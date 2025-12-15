using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Text;
using System.Threading;
using UnityEngine;

public class LocalWebServer : MonoBehaviour
{
    private Thread serverThread;
    private TcpListener listener;
    private bool isRunning;

    [Header("服务器配置")] public int defaultPort = 8080;
    public int minPort = 8081;
    public int maxPort = 9000;
    [Tooltip("客户端连接超时时间（毫秒）")] public int clientTimeout = 5000;

    [Header("网站根目录配置")] [Tooltip("StreamingAssets 下的子文件夹名称（留空则使用StreamingAssets根目录）")]
    public string webRootSubFolder = "MyWebsite";

    // 实际的网站根目录（StreamingAssets + 子文件夹）
    private string actualWebRootPath;

    // 大文件分块传输大小
    private const int BUFFER_SIZE = 8192;

    // 当前使用的IP和端口
    private string currentIp;
    private int currentPort;

    /// <summary>
    /// 获取本机可用IP和端口的完整URL
    /// </summary>
    /// <returns>格式如 "ip:port" 的字符串</returns>
    public string GetLocalIpAddressPort()
    {
        string localIp = String.Empty;
        var host = Dns.GetHostEntry(Dns.GetHostName());
        var ipv4 = host.AddressList
            .FirstOrDefault(ip => ip.AddressFamily == AddressFamily.InterNetwork);

        if (ipv4 != null)
        {
            localIp = ipv4.ToString();
            Debug.Log("IPv4 地址: " + ipv4);
        }
        else
        {
            Debug.Log("未找到 IPv4 地址，使用回环地址");
            localIp = IPAddress.Loopback.ToString();
        }

        var port = GetFirstAvailablePort(defaultPort, minPort, maxPort);
        if (port == null)
        {
            Debug.LogError("未找到可用端口");
            return null;
        }

        Debug.Log("端口 : " + port);
        string url = $"{localIp}:{port}";
        Debug.Log("本机地址和端口 : " + url);
        return url;
    }

    /// <summary>
    /// 通过指定的URL启动服务器
    /// </summary>
    /// <param name="url">格式如 "ip:port" 的字符串</param>
    public void StartServer(string url)
    {
        if (string.IsNullOrEmpty(url))
        {
            Debug.LogError("无效的URL");
            return;
        }

        // 解析IP和端口
        var parts = url.Split(':');
        if (parts.Length != 2 || !int.TryParse(parts[1], out int port))
        {
            Debug.LogError("URL格式错误，应为 ip:port");
            return;
        }

        currentIp = parts[0];
        currentPort = port;

        // 初始化实际网站根目录
        actualWebRootPath = Path.Combine(Application.streamingAssetsPath, webRootSubFolder);

        // 校验目录是否存在
        if (!Directory.Exists(actualWebRootPath))
        {
            Debug.LogError($"网站根目录不存在: {actualWebRootPath}\n请检查 StreamingAssets 下是否有 {webRootSubFolder} 文件夹");
            return;
        }

        isRunning = true;
        serverThread = new Thread(RunServer);
        serverThread.IsBackground = true;
        serverThread.Start();

        Debug.Log($"网站根目录已设置为: {actualWebRootPath}");
    }

    /// <summary>
    /// 使用默认配置启动服务器
    /// </summary>
    public void StartServer()
    {
        string url = GetLocalIpAddressPort();
        if (!string.IsNullOrEmpty(url))
        {
            StartServer(url);
        }
        else
        {
            Debug.LogError("无法获取有效的IP和端口，启动失败");
        }
    }

    /// <summary>
    /// 停止服务器和线程
    /// </summary>
    public void StopServerAndThread()
    {
        StopServer();
        if (serverThread != null && serverThread.IsAlive)
        {
            serverThread.Join(1000);
            if (serverThread.IsAlive)
            {
                serverThread.Abort();
            }
        }
    }

    #region 服务器相关

    private void RunServer()
    {
        try
        {
            // 使用预先获取的IP和端口
            IPAddress localIp = IPAddress.Parse(currentIp);
            listener = new TcpListener(localIp, currentPort);
            listener.Start();
            Debug.Log($"服务器启动成功: http://{currentIp}:{currentPort} 或 http://localhost:{currentPort}");

            while (isRunning)
            {
                if (listener.Pending())
                {
                    TcpClient client = listener.AcceptTcpClient();
                    // 设置客户端超时，避免长时间阻塞
                    client.ReceiveTimeout = clientTimeout;
                    client.SendTimeout = clientTimeout;
                    // 使用线程池处理客户端请求
                    ThreadPool.QueueUserWorkItem(HandleClient, client);
                }
                else
                {
                    Thread.Sleep(100);
                }
            }
        }
        catch (Exception ex)
        {
            if (isRunning)
            {
                Debug.LogError($"服务器运行错误: {ex.Message}");
            }
        }
        finally
        {
            StopServer();
        }
    }

    private void HandleClient(object obj)
    {
        TcpClient client = obj as TcpClient;
        if (client == null) return;

        try
        {
            using (client)
            {
                // 检测客户端是否已断开连接
                if (!client.Connected) return;

                using (NetworkStream stream = client.GetStream())
                {
                    // 读取客户端请求（带超时保护）
                    byte[] buffer = new byte[BUFFER_SIZE];
                    int bytesRead = 0;
                    try
                    {
                        bytesRead = stream.Read(buffer, 0, buffer.Length);
                    }
                    catch (IOException ex)
                    {
                        Debug.LogWarning($"客户端读取超时/断开: {ex.Message}");
                        return;
                    }

                    if (bytesRead <= 0) return;

                    string request = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                    string requestedPath = ParseRequestPath(request);
                    string localFilePath = ResolveLocalFilePath(requestedPath);

                    // 响应请求
                    if (File.Exists(localFilePath))
                    {
                        FileInfo fileInfo = new FileInfo(localFilePath);
                        if (fileInfo.Length > 1024 * 1024) // 大于1MB的文件使用分块传输
                        {
                            SendLargeFileResponse(stream, localFilePath, fileInfo, client);
                        }
                        else
                        {
                            SendSmallFileResponse(stream, localFilePath, client);
                        }
                    }
                    else
                    {
                        if (client.Connected) // 仅当连接有效时发送404
                        {
                            Debug.LogWarning($"文件未找到: {localFilePath}");
                            SendNotFoundResponse(stream, requestedPath);
                        }
                    }

                    if (client.Connected)
                    {
                        stream.Flush();
                    }
                }
            }
        }
        catch (SocketException ex)
        {
            // 忽略客户端主动断开的异常（常见情况，无需报错）
            if (ex.SocketErrorCode != SocketError.ConnectionAborted &&
                ex.SocketErrorCode != SocketError.ConnectionReset &&
                ex.SocketErrorCode != SocketError.Disconnecting)
            {
                Debug.LogWarning($"Socket异常（非断开）: {ex.Message}");
            }
        }
        catch (Exception ex)
        {
            Debug.LogWarning($"处理请求出错: {ex.Message}");
        }
    }

    /// <summary>
    /// 解析HTTP请求中的路径
    /// </summary>
    private string ParseRequestPath(string request)
    {
        try
        {
            string[] lines = request.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
            if (lines.Length == 0) return "/";

            string[] firstLineParts = lines[0].Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            return firstLineParts.Length >= 2 ? firstLineParts[1] : "/";
        }
        catch
        {
            return "/";
        }
    }

    /// <summary>
    /// 解析请求路径到本地文件路径
    /// </summary>
    private string ResolveLocalFilePath(string requestedPath)
    {
        // 1. 移除URL中的查询参数
        int queryIndex = requestedPath.IndexOf('?');
        if (queryIndex != -1)
        {
            requestedPath = requestedPath.Substring(0, queryIndex);
        }

        // 2. 处理根路径请求
        if (requestedPath == "/" || string.IsNullOrEmpty(requestedPath))
        {
            requestedPath = "/index.html";
        }

        // 3. 拼接实际本地路径
        string relativePath = requestedPath.TrimStart('/');
        string localFilePath = Path.Combine(actualWebRootPath, relativePath);

        // 4. 处理Windows路径分隔符问题
        localFilePath = localFilePath.Replace('/', Path.DirectorySeparatorChar);

        return localFilePath;
    }

    /// <summary>
    /// 发送小文件响应（带连接状态检测）
    /// </summary>
    private void SendSmallFileResponse(NetworkStream stream, string filePath, TcpClient client)
    {
        try
        {
            if (!client.Connected) return;

            byte[] fileContent = File.ReadAllBytes(filePath);
            string extension = Path.GetExtension(filePath).ToLower();
            string contentType = GetContentType(extension);

            string responseHeader = $"HTTP/1.1 200 OK\r\n" +
                                    $"Content-Type: {contentType}\r\n" +
                                    $"Content-Length: {fileContent.Length}\r\n" +
                                    $"Access-Control-Allow-Origin: *\r\n" +
                                    $"Cache-Control: no-cache\r\n" +
                                    $"Connection: close\r\n\r\n";

            byte[] headerBytes = Encoding.UTF8.GetBytes(responseHeader);

            // 分两次发送，每次都检测连接状态
            if (client.Connected)
            {
                stream.Write(headerBytes, 0, headerBytes.Length);
                stream.Flush();
            }

            if (client.Connected)
            {
                stream.Write(fileContent, 0, fileContent.Length);
                stream.Flush();
            }

            // Debug.Log($"已响应小文件: {filePath} ({contentType})");
        }
        catch (IOException ex)
        {
            Debug.LogWarning($"发送小文件时客户端断开: {filePath} | {ex.Message}");
        }
        catch (Exception ex)
        {
            Debug.LogError($"发送小文件失败: {filePath} | {ex.Message}");
            if (client.Connected)
            {
                SendServerErrorResponse(stream);
            }
        }
    }

    /// <summary>
    /// 发送大文件响应（带逐块连接检测）
    /// </summary>
    private void SendLargeFileResponse(NetworkStream stream, string filePath, FileInfo fileInfo, TcpClient client)
    {
        try
        {
            if (!client.Connected) return;

            string extension = Path.GetExtension(filePath).ToLower();
            string contentType = GetContentType(extension);

            // 构建HTTP响应头
            string responseHeader = $"HTTP/1.1 200 OK\r\n" +
                                    $"Content-Type: {contentType}\r\n" +
                                    $"Content-Length: {fileInfo.Length}\r\n" +
                                    $"Access-Control-Allow-Origin: *\r\n" +
                                    $"Accept-Ranges: bytes\r\n" +
                                    $"Cache-Control: no-cache\r\n" +
                                    $"Connection: close\r\n\r\n";

            byte[] headerBytes = Encoding.UTF8.GetBytes(responseHeader);

            // 发送响应头（检测连接）
            if (client.Connected)
            {
                stream.Write(headerBytes, 0, headerBytes.Length);
                stream.Flush();
            }
            else
            {
                return;
            }

            // 分块读取并发送大文件（逐块检测连接）
            using (FileStream fileStream =
                   new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, BUFFER_SIZE))
            {
                byte[] buffer = new byte[BUFFER_SIZE];
                int bytesRead;
                long totalSent = 0;

                while (totalSent < fileInfo.Length && client.Connected)
                {
                    bytesRead = fileStream.Read(buffer, 0, buffer.Length);
                    if (bytesRead <= 0) break;

                    try
                    {
                        // 发送当前块（带超时）
                        stream.Write(buffer, 0, bytesRead);
                        stream.Flush();
                        totalSent += bytesRead;
                    }
                    catch (IOException)
                    {
                        // 客户端断开，直接退出循环
                        break;
                    }
                }

                if (client.Connected)
                {
                    Debug.Log($"已响应大文件: {filePath} ({contentType}) - 发送大小: {totalSent / 1024 / 1024:F2}MB");
                }
                else
                {
                    Debug.LogWarning(
                        $"大文件传输中断: {filePath} - 已发送: {totalSent / 1024 / 1024:F2}MB / 总大小: {fileInfo.Length / 1024 / 1024:F2}MB");
                }
            }
        }
        catch (IOException ex)
        {
            Debug.LogWarning($"发送大文件时客户端断开: {filePath} | {ex.Message}");
        }
        catch (Exception ex)
        {
            Debug.LogError($"发送大文件失败: {filePath} | {ex.Message}");
            if (client.Connected)
            {
                SendServerErrorResponse(stream);
            }
        }
    }

    /// <summary>
    /// 获取文件对应的MIME类型
    /// </summary>
    private string GetContentType(string extension)
    {
        return extension switch
        {
            // 基础文本类型
            ".html" or ".htm" => "text/html; charset=utf-8",
            ".js" => "application/javascript; charset=utf-8",
            ".css" => "text/css; charset=utf-8",
            ".json" => "application/json; charset=utf-8",
            ".txt" => "text/plain; charset=utf-8",

            // 图片类型
            ".png" => "image/png",
            ".jpg" or ".jpeg" => "image/jpeg",
            ".gif" => "image/gif",
            ".ico" => "image/x-icon",
            ".svg" => "image/svg+xml",

            // 字体类型
            ".woff" => "font/woff",
            ".woff2" => "font/woff2",
            ".ttf" => "font/ttf",

            // 媒体文件类型
            ".mp3" => "audio/mpeg",
            ".webm" => "video/webm",
            ".ogg" => "audio/ogg",
            ".mp4" => "video/mp4",

            // 兜底类型
            _ => "application/octet-stream",
        };
    }

    /// <summary>
    /// 停止服务器
    /// </summary>
    private void StopServer()
    {
        isRunning = false;
        if (listener != null)
        {
            try
            {
                listener.Stop();
                Debug.Log("服务器已停止");
            }
            catch (Exception ex)
            {
                Debug.LogError($"停止服务器出错: {ex.Message}");
            }
            finally
            {
                listener = null;
            }
        }
    }

    #endregion

    #region 错误响应处理

    private void SendNotFoundResponse(NetworkStream stream, string path)
    {
        try
        {
            string errorHtml =
                $"<html><head><meta charset='UTF-8'></head><body><h1>404 未找到</h1><p>请求路径: {path}</p><p>根目录: {actualWebRootPath}</p></body></html>";
            byte[] content = Encoding.UTF8.GetBytes(errorHtml);

            string header = $"HTTP/1.1 404 Not Found\r\n" +
                            $"Content-Type: text/html; charset=utf-8\r\n" +
                            $"Content-Length: {content.Length}\r\n" +
                            $"Connection: close\r\n\r\n";

            byte[] headerBytes = Encoding.UTF8.GetBytes(header);
            stream.Write(headerBytes, 0, header.Length);
            stream.Write(content, 0, content.Length);
        }
        catch
        {
            // 忽略404发送失败（客户端已断开）
        }
    }

    private void SendServerErrorResponse(NetworkStream stream)
    {
        try
        {
            string errorHtml = "<html><head><meta charset='UTF-8'></head><body><h1>500 服务器内部错误</h1></body></html>";
            byte[] content = Encoding.UTF8.GetBytes(errorHtml);

            string header = $"HTTP/1.1 500 Internal Server Error\r\n" +
                            $"Content-Type: text/html; charset=utf-8\r\n" +
                            $"Content-Length: {content.Length}\r\n" +
                            $"Connection: close\r\n\r\n";

            byte[] headerBytes = Encoding.UTF8.GetBytes(header);
            stream.Write(headerBytes, 0, header.Length);
            stream.Write(content, 0, content.Length);
        }
        catch
        {
            // 忽略500发送失败
        }
    }

    #endregion

    #region 获取可用端口号

    /// <summary>
    /// 获取可用端口号
    /// </summary>
    /// <param name="defaultPort">默认指定的端口号</param>
    /// <param name="minPort">最小端口范围</param>
    /// <param name="maxPort">最大端口范围</param>
    /// <returns>返回可用端口号，无可用则返回null</returns>
    public static int? GetFirstAvailablePort(int defaultPort, int minPort, int maxPort)
    {
        if (PortIsAvailable(defaultPort))
        {
            return defaultPort;
        }

        for (int port = minPort; port <= maxPort; port++)
        {
            if (PortIsAvailable(port))
            {
                return port;
            }
        }

        return null;
    }

    /// <summary>
    /// 检测指定端口是否被占用
    /// </summary>
    /// <param name="port">指定的端口号</param>
    /// <returns>如果端口可用返回True；否则返回False</returns>
    public static bool PortIsAvailable(int port)
    {
        IList portUsed = GetUsedPorts();
        foreach (int p in portUsed)
        {
            if (p == port) return false;
        }

        return true;
    }

    /// <summary>
    /// 获取系统已经被占用的端口号
    /// </summary>
    /// <returns>被占用端口号列表</returns>
    private static IList GetUsedPorts()
    {
        IPGlobalProperties ipGlobalProperties = IPGlobalProperties.GetIPGlobalProperties();
        IPEndPoint[] ipsTCP = ipGlobalProperties.GetActiveTcpListeners();
        IPEndPoint[] ipsUDP = ipGlobalProperties.GetActiveUdpListeners();
        TcpConnectionInformation[] tcpConnections = ipGlobalProperties.GetActiveTcpConnections();

        IList allPorts = new ArrayList();
        foreach (IPEndPoint ep in ipsTCP)
        {
            allPorts.Add(ep.Port);
        }

        foreach (IPEndPoint ep in ipsUDP)
        {
            allPorts.Add(ep.Port);
        }

        foreach (TcpConnectionInformation conn in tcpConnections)
        {
            allPorts.Add(conn.LocalEndPoint.Port);
        }

        return allPorts;
    }

    #endregion

    // 可选：验证网站根目录
    [ContextMenu("验证网站根目录")]
    private void ValidateWebRoot()
    {
        actualWebRootPath = Path.Combine(Application.streamingAssetsPath, webRootSubFolder);
        if (Directory.Exists(actualWebRootPath))
        {
            var mediaFiles = Directory.GetFiles(actualWebRootPath, "*.*", SearchOption.AllDirectories)
                .Where(f => f.EndsWith(".mp3") || f.EndsWith(".webm"))
                .ToList();

            string fileList = mediaFiles.Count > 0
                ? string.Join("\n", mediaFiles)
                : "未找到.mp3/.webm文件";

            Debug.Log($"✅ 目录存在: {actualWebRootPath}\n媒体文件列表:\n{fileList}");
        }
        else
        {
            Debug.LogError($"❌ 目录不存在: {actualWebRootPath}");
        }
    }
}
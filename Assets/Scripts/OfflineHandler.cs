using System;
using System.Collections;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using Debug = UnityEngine.Debug; // 解决命名冲突
using System.Net;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using UnityEngine;
using Vuplex.WebView;

public class OfflineHandler : MonoBehaviour
{
    private string appName = "Aws";
    public CanvasWebViewPrefab _canvasPrefab;
    public Action StopServerAction;

    // Start is called before the first frame update
    void Start()
    {
        if (_canvasPrefab == null)
        {
            Debug.LogWarning("Canvas prefab is null");
            return;
        }

        var isInter = IsNetworkReachability();
        Debug.Log($"{isInter}");

        // isInter = false;

        if (!isInter)
        {
            StartLocalServer();

            // ChangeUrl("http://localhost", 2000);
            ChangeUrl(GetLocalIpAddressPort(), 2000);
            StopServerAction = () => { TerminateProcess(appName); };
        }
        else
        {
            ChangeUrl("https://tme.tmvmc.cn:19999/ai/test_VR/");
        }
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // StopServerAction?.Invoke();
            SendMessageToWeb();
            // GetMessageToWeb();
        }
    }

    private void OnDestroy()
    {
        TerminateProcess(appName);
    }


    /// <summary>
    /// 修改_canvasPrefab上的url
    /// </summary>
    /// <param name="url"></param>
    /// <param name="delayTime"></param>
    private async void ChangeUrl(string url, int delayTime = 0)
    {
        Debug.Log($"{url}");
        await Task.Delay(delayTime);
        Closebrowser();
        await _canvasPrefab.WaitUntilInitialized();
        _canvasPrefab.WebView.LoadUrl(url);
    }


    /// <summary>
    /// 网络可达性
    /// </summary> 
    /// <returns></returns>
    private bool IsNetworkReachability()
    {
        switch (Application.internetReachability)
        {
            case NetworkReachability.ReachableViaLocalAreaNetwork:
                Debug.Log("当前使用的是：WiFi，请放心更新！");
                return true;
            case NetworkReachability.ReachableViaCarrierDataNetwork:
                Debug.Log("当前使用的是移动网络，是否继续更新？");
                return true;
            default:
                Debug.Log("当前没有联网，请您先联网后再进行操作！");
                return false;
        }
    }

    /// <summary>
    /// 启动本地服务器
    /// </summary>
    private void StartLocalServer()
    {
        var appPath = Path.Combine(Application.streamingAssetsPath, "test_A2x\\Aws.exe");

        if (File.Exists(appPath))
        {
            Process.Start(appPath);
        }
        else
        {
            Debug.LogError($"程序不存在: {appPath}");
        }

        Process.Start(appPath);
    }


    /// <summary>
    /// 终止程序，参数是程序名称（不带后缀）
    /// </summary>
    /// <param name="processName"></param>
    private void TerminateProcess(string processName)
    {
        foreach (Process process in Process.GetProcesses())
        {
            try
            {
                if (!process.HasExited &&
                    process.ProcessName.Equals(processName, StringComparison.OrdinalIgnoreCase))
                {
                    process.Kill();
                    Debug.Log($"已终止进程: {processName}");
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"终止失败: {ex.Message}");
            }
        }
    }

    /// <summary>
    /// 得到本机IP地址
    /// </summary>
    /// <returns></returns>
    private string GetLocalIpAddressPort()
    {
        string localIp = String.Empty;
        var host = Dns.GetHostEntry(Dns.GetHostName());
        var ipv4 = host.AddressList
            .FirstOrDefault(ip => ip.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork);
        if (ipv4 != null)
        {
            localIp = ipv4.ToString();
            Debug.Log("IPv4 地址: " + ipv4);
        }
        else
        {
            Debug.Log("未找到 IPv4 地址");
        }

        var port = GetFirstAvailablePort(8081, 8081, 9000);
        Debug.Log("端口 : " + port);
        Debug.Log("本机地址和端口 : " + localIp + ":" + port);
        return localIp + ":" + port;
    }

    /// <summary>
    /// 获取可用端口号
    /// </summary>
    /// <param name="defaultPort">默认指定的端口号</param>
    /// <returns>返回可用端口号</returns>
    public static int? GetFirstAvailablePort(int defaultPort, int minPort, int maxPort)
    {
        if (PortIsAvailabe(defaultPort))
        {
            return defaultPort;
        }

        for (int port = minPort; port <= maxPort; port++)
        {
            if (PortIsAvailabe(port))
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
    /// <returns>如果端口号被占用，返回True；否则返回False</returns>
    public static bool PortIsAvailabe(int port)
    {
        IList portUsed = PortIsUsed();
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
    private static IList PortIsUsed()
    {
        IPGlobalProperties iPGlobalProperties = IPGlobalProperties.GetIPGlobalProperties();
        IPEndPoint[] ipsTCP = iPGlobalProperties.GetActiveTcpListeners();
        IPEndPoint[] ipsUDP = iPGlobalProperties.GetActiveUdpListeners();
        TcpConnectionInformation[] tcpConnections = iPGlobalProperties.GetActiveTcpConnections();

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

    /// <summary>
    /// 关闭本地默认浏览器
    /// </summary>
    private void Closebrowser()
    {
        // List of common browser process names
        string[] browserNames = { "chrome", "firefox", "iexplore", "msedge" };

        foreach (var browserName in browserNames)
        {
            var processes = Process.GetProcessesByName(browserName);
            if (processes.Length > 0)
            {
                Console.WriteLine($"{browserName} is running. Closing it...");
                foreach (var process in processes)
                {
                    try
                    {
                        process.Kill();
                        process.WaitForExit(); // Wait for the process to exit
                        Console.WriteLine($"{browserName} has been closed.");
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Failed to close {browserName}: {ex.Message}");
                    }
                }
            }
            else
            {
                Console.WriteLine($"{browserName} is not running.");
            }
        }
    }

    private async void SendMessageToWeb()
    {
        var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
        path += "/TME/" + Application.productName + "/";
        string json = "{\"pdfPath\":\"" + path + "\"}";

        await _canvasPrefab.WaitUntilInitialized();
        // await _canvasPrefab.WebView.WaitForNextPageLoadToFinish();
        _canvasPrefab.WebView.PostMessage(json);

        GetMessageToWeb();
    }

    private async void GetMessageToWeb()
    {
        await _canvasPrefab.WaitUntilInitialized();
        // await _canvasPrefab.WebView.WaitForNextPageLoadToFinish();
        _canvasPrefab.WebView.MessageEmitted += OnMessage;
    }

    private void OnMessage(object sender, EventArgs<string> eventArgs)
    {
        Debug.Log("JSON received: " + eventArgs.Value);

        // 将JSON字符串转换为QuizData对象
        QuizData quizData = new QuizData();
        quizData = JsonUtility.FromJson<QuizData>(eventArgs.Value);

        // 输出结果以验证转换是否成功

        for (int i = 0; i < quizData.Questions.Length; i++)
        {
            var temp = quizData.Questions[i];
            Debug.Log($"{temp.count}:{temp.T} :{temp.isRight}");
        }
    }
}

[Serializable]
public class QuizData
{
    public Question[] Questions;
}

[Serializable]
public class Question
{
    public int count;
    public string T;
    public bool isRight;
}
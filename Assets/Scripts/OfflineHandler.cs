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
    public CanvasWebViewPrefab _canvasPrefab;
    private LocalWebServer _localWebServer;

    // Start is called before the first frame update
    void Start()
    {
        if (_canvasPrefab == null)
        {
            Debug.LogWarning("Canvas prefab is null");
            return;
        }

        _localWebServer = this.GetComponent<LocalWebServer>();

        if (_localWebServer == null)
        {
        }

        var isInter = IsNetworkReachability();
        Debug.Log($"{isInter}");

        // isInter = false;

        if (!isInter)
        {
            string url = _localWebServer.GetLocalIpAddressPort();
            _localWebServer.StartServer(url);
            ChangeUrl(url);
        }
        else
        {
            ChangeUrl("https://tme.tmvmc.cn:19999/ai/test_VR/");
        }

        GetMessageToWeb();
    }

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Space))
        {
            // StopServerAction?.Invoke();
            // SendMessageToWeb();
            // GetMessageToWeb();
        }
    }

    private void OnDestroy()
    {
        _localWebServer.StopServerAndThread();
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
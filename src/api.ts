import fetchJsonp from 'fetch-jsonp';

export interface Article {
  id: string;
  /**
   * 文章发布时间
   */
  otime: string;
  /**
   * 文章来源
   */
  source: string;
  /**
   * 文章标题
   */
  title: string;
  /**
   * 文章摘要
   */
  summary: string;
  /**
   * 文章标签
   */
  tag: string;
  /**
   * 音频文件地址
   */
  yuyinUrl: string;
  /**
   * 文章详情页地址
   */
  contentUrl: string;

  curPlay: boolean;

  browseInfo?: NewsCount;
}

export interface ArticleList {
  data: Article[];
}

export interface ArticleContent {
  id: string;
  title: string;
  /**
   * 文章内容, html格式
   */
  content: string;
  source: string;
  tag: string;
  otime: string;
  author: string;
  yuyinUrl: string;
}

export interface NewsCount {
  refName: string;
  /**
   * 浏览量
   */
  browse: string;
  share: string;
  store: string;
}

interface NewsResponse {
  data: {
    [newsId: string]: NewsCount;
  };
  err: number;
  msg: string | null;
}

interface ReadResponse {
  data: string;
  err: number;
  msg: string | null;
}

interface SaveResponse {
  success: boolean;
  resultObj: {
    isCollect?: string;
  };
  resultCode: string;
}

const prodApiAddr = 'https://api.app.gtja.com/';

function getAPIUrl(pageNum: number = 1): string {
  return `https://dl.app.gtja.com/news/xiaojunFM/page_${pageNum}.json`;
  // return `http://114.141.165.129/news/xiaojunFM/page_${pageNum}.json`;
  // return 'http://10.176.118.24:8000/page1.json';
}

function getCountUrl(newsIds: string[]) {
  const url = prodApiAddr + 'sc/v1/yyz/ref/action/getcount?version=8.1&from=android&refnames=';
  // const url = 'http://114.141.165.129/sc/v1/yyz/ref/action/getcount?version=8.1&from=android&refnames=';
  const ids = newsIds.map(oneId => `news_${oneId}`).join(',');
  return `${url}${ids}`;
}

function getReadUrl(): string {
  const url = prodApiAddr + 'sc/v1/yyz/ref/action?version=8.1&from=android&actiontype=browse';
  // const url = 'http://114.141.165.129/sc/v1/yyz/ref/action?version=8.1&from=android&actiontype=browse';
  return url;
}

/**
 * 分享接口地址
 */
function getShareUrl(): string {
  const url = prodApiAddr + 'sc/v1/yyz/ref/action?version=8.1&from=android&actiontype=share';
  // const url = 'http://114.141.165.129/sc/v1/yyz/ref/action?version=8.1&from=android&actiontype=share';
  return url;
}

/**
 * 生成分享的地址
 * @param sourceUrl 文章源路径
 */
function genShareUrl(sourceUrl: string): string {
  return `http://dl.app.gtja.com/nrng/newShares/fm-share.html?url=${sourceUrl}`;
}

/**
 * 收藏接口地址
 */
function getStoreUrl(): string {
  const url = prodApiAddr + 'sc/v1/yyz/ref/action?version=8.1&from=android&actiontype=store';
  // const url = 'http://114.141.165.129/sc/v1/yyz/ref/action?version=8.1&from=android&actiontype=store';
  return url;
}

function getReadBody(newsId: string): string {
  const date = new Date();
  const dateString = date.getFullYear() +  '' + (date.getMonth() + 1) + date.getDate();

  const key = newsId.includes('news') ? newsId : `news_${newsId}`;
  const params = {
    [key]: dateString,
  };

  return JSON.stringify(params);
}

export function getArticles(pagenum: number = 1): Promise<ArticleList> {
  return fetchJsonp(getAPIUrl(pagenum), {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 获取文章详情
 * @param contentUrl 文章详情地址
 */
export function getArticleContent(contentUrl: string): Promise<ArticleContent> {
  return fetchJsonp(contentUrl, {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 获取文章阅读量
 * @param newsIds 文章ID数组
 */
export function getReadCount(newsIds: string[]): Promise<NewsResponse> {
  return fetch(getCountUrl(newsIds))
    .then(resp => {
      return resp.json();
    });
}

/**
 * 阅读文章接口
 * @param newsId 文章ID
 */
export function readArticle(newsId: string): Promise<ReadResponse> {
  return fetch(getReadUrl(), {
    method: 'PUT',
    body: getReadBody(newsId),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 分享文章接口
 * @param newsId 文章ID
 */
export function shareArticle(newsId: string): Promise<ReadResponse> {
  return fetch(getShareUrl(), {
    method: 'PUT',
    body: getReadBody(newsId),
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 收藏文章接口
 * @param newsId 文章ID
 */
export function storeArticle(newsId: string): Promise<ReadResponse>  {
  return fetch(getStoreUrl(), {
    method: 'PUT',
    body: getReadBody(newsId),
  }).then(resp => {
    return resp.json();
  });
}

const saveUrlPre = prodApiAddr + 'comments/cloudcollect';
// const saveUrlPre = 'http://114.141.165.129/comments/cloudcollect';

/**
 * 客户端收藏文章
 * @param params 收藏的文章详情
 */
export function saveArticle(params: {
  id: string,
  userId: string,
  clientType?: string,
  otime?: string,
  source?: string,
  title?: string,
  url?: string,
}): Promise<SaveResponse> {
  // const saveUrl = saveUrlPre + '/save';
  const saveUrl = prodApiAddr + 'comments/cloudcollect/save/v2/?'
  + `userId=${params.userId}&refId=${params.id}`;

  return fetch(saveUrl, {
    method: 'GET',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 检查是否收藏了文章
 * @param refId 文章ID
 * @param userId 用户ID
 */
export function checkIfCollectArticle(refId: string, userId: string): Promise<SaveResponse> {
  const checkUrl = saveUrlPre + '/checkCollectOrNot?' + `refId=${refId}&userId=${userId}`;
  return fetch(checkUrl, {
    method: 'GET',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 取消收藏文章
 * @param refId 文章ID
 * @param userId 用户ID
 */
export function deleteArticle(refId: string, userId: string): Promise<SaveResponse> {
  const deleteUrl = saveUrlPre + '/delete?' + `refId=${refId}&userId=${userId}`;
  return fetch(deleteUrl, {
    method: 'GET',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 分享接口
 * @param title 分享标题
 * @param content 分享内容
 * @param linkurl 分享链接
 * @param moments 分享方式
 * @param icon 分享图标
 */
export function share(title: string, content: string, linkurl: string, moments: string, icon: string) {
  // const shareid = LocalDAO.getShareid() || CommonUtil.getUrlParam('shareid')
  const shareid = '';
  window.location.href = 'gtjayyznormal://yyzShare?activitycode=201611_NRNG&title=' +
    title + '&icon=' + icon + '&content=' + content + '&moments=' + moments +
    '&linkurl=' + genShareUrl(linkurl) + '&shareid=' + shareid + '&activitycode=201611_NRNG';
}

/**
 * 调用原生股票行情
 * @param stockCode 股票代码
 * @param h5module h5模块
 * @param islogin 是否登录
 */
export function callStockAlive(stockCode: string, h5module: string, islogin: string) {
  Bridge.callByJsUrl('gtjanrng://callQuotation?stockcode='
    + stockCode + '&h5module=' + h5module + '&islogin=' + islogin, () => true , '10006-1');
}

/**
 * 调用原生登录
 */
export function callNativeLogin(): Promise<any> {
  const registerUrl = 'gtjanrng://register';
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(registerUrl, (response: any) => {
      if (Number(response.error) === 1) {
        reject(new Error(response.data));
      } else {
        const userCode = response.data.user_code;
        const nickName = response.data.nick_name;
        sessionStorage.setItem('userCode', userCode);
        resolve(response);
      }
    });
  });
}

/**
 * 获取网络状态
 */
export function getNetworkStatus(): Promise<any> {
  const networkStatusUrl = 'gtjafm://getnetworkstatus';
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(networkStatusUrl, (response: any) => {
      if (Number(response.error) === 0) {
        resolve(response);
      } else {
        reject(response);
      }
    });
  });
}

// 播放
export function playAudioByNative(audioUrl: string, newsId: string, title: string): Promise<any> {
  const url = `gtjafm://playAudio?url=${audioUrl}&newsId=${newsId}&title=${title}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      // if (Number(response.error) === 0) {
      resolve(response);
      // } else {
      //   reject(response);
      // }
    });
  });
}

// 暂停
export function pauseAudioByNative(audioUrl: string): Promise<any> {
  const url = `gtjafm://pauseAudio?url=${audioUrl}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      // if (Number(response.error) === 0) {
      resolve(response);
      // } else {
      //   reject(response);
      // }
    });
  });
}

// 恢复
export function resumeAudioByNative(audioUrl: string): Promise<any> {
  const url = `gtjafm://resumeAudio?url=${audioUrl}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      // if (Number(response.error) === 0) {
      resolve(response);
      // } else {
      //   reject(response);
      // }
    });
  });
}

// 停止
export function stopAudioByNative(audioUrl: string): Promise<any> {
  const url = `gtjafm://stopAudio?url=${audioUrl}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      // if (Number(response.error) === 0) {
      resolve(response);
      // } else {
      //   reject(response);
      // }
    });
  });
}

// 获取进度
export function getAudioProgress(): Promise<any> {
  const url = 'gtjafm://getProgress';
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      resolve(response);
    });
  });
}

// 改变播放进度
export function seekAudioProgress(audioUrl: string, progress: number): Promise<any> {
  const url = `gtjafm://seekAudio?url=${audioUrl}&progress=${progress}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      // if (Number(response.error) === 0) {
      resolve(response);
      // } else {
      //   reject(response);
      // }
    });
  });
}

// 返回原生
export function backToNative(
  audioUrl: string,
  newsId: string,
  summary: string,
  pageNum: number,
  index: number,
): Promise<any> {
  const url = `gtjafm://backFM?url=${audioUrl}&summary=${summary.substring(0, 20)}&newsid=${newsId}&pageNum=${pageNum}&index=${index}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      resolve(response);
    });
  });
}

/**
 * 获取最新资讯
 * @param pagenum 页数
 */
export function getNewArticles(pagenum: number = 1): Promise<ArticleList> {
  const url = `https://dl.app.gtja.com/news/xiaojunFMjsonp/page_${pagenum}.json`;
  return fetchJsonp(url, {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 获取实时短咨询
 * @param pagenum 页数
 */
export function getRealTimeArticles(pagenum: number = 1): Promise<ArticleList> {
  const url = `https://dl.app.gtja.com/news/shishijsonp/page_${pagenum}.json`;
  return fetchJsonp(url, {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 获取研报咨询
 * @param pagenum 页数
 */
export function getYanbaoArticles(pagenum: number = 1): Promise<ArticleList> {
  const url = `https://dl.app.gtja.com/news/tuijianbanner/yanbao850jsonp/page_${pagenum}.json`;
  return fetchJsonp(url, {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 获取小君解盘咨询
 * @param pagenum 页数
 */
export function getJiepanArticles(pagenum: number = 1): Promise<ArticleList> {
  const url = `https://dl.app.gtja.com/news/tuijianbanner/dianpingjsonp/page_${pagenum}.json`;
  return fetchJsonp(url, {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 获取早报咨询
 * @param pagenum 页数
 */
export function getZaobaoArticles(pagenum: number = 1): Promise<ArticleList> {
  const url = `https://dl.app.gtja.com/news/xiaojunFM/page_${pagenum}.json`;
  return fetchJsonp(url, {
    jsonpCallbackFunction: 'success',
  }).then(resp => {
    return resp.json();
  });
}

/**
 * 调用原生接口进行语音播报
 * @param contentUrl 获取文章详情的url
 */
export function readContent(contentUrl: string): Promise<any> {
  const url = `gtjaifly://readContent?url=${contentUrl}`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      resolve(response);
    });
  });
}

/**
 * 暂停语音播报
 * @param contentUrl 获取文章详情的url
 */
export function pauseRead(): Promise<any> {
  const url = `gtjaifly://pauseRead`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      resolve(response);
    });
  });
}

/**
 * 继续播报语音
 * @param contentUrl 获取文章详情的url
 */
export function resumeRead(): Promise<any> {
  const url = `gtjaifly://resumeRead`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      resolve(response);
    });
  });
}

/**
 * 取消播报语音
 * @param contentUrl 获取文章详情的url
 */
export function cancelRead(): Promise<any> {
  const url = `gtjaifly://cancelRead`;
  return new Promise((resolve, reject) => {
    Bridge.callByJsUrl(url, (response: any) => {
      resolve(response);
    });
  });
}

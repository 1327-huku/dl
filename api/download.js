const ytdl = require('@distube/ytdl-core');

module.exports = async (req, res) => {
  const { url } = req.query;
  if (!url || !ytdl.validateURL(url)) {
    return res.status(400).send('有効なYouTubeのURLを入力してください');
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title.replace(/[^\w\sぁ-んァ-ヶー一-龠]/g, '') || 'audio';

    res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(title)}.m4a`);
    res.setHeader('Content-Type', 'audio/mp4');

    ytdl(url, { quality: 'highestaudio', filter: 'audioonly' }).pipe(res);
  } catch (err) {
    res.status(500).send('取得エラー: ' + err.message);
  }
};

// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-blue; icon-glyph: newspaper;
// name: tagesschau-widget_v2.js
// description: A scriptable widget which displays the latest tagesschau.de article 📰
// original author: Torben Haack
// email: haack@hey.com
// edited by zivi7 (udun.care@gmx.de) to work after an update of Tagesschau.de

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

let tagesschauData;

  tagesschauData = await new Request(
    'https://www.tagesschau.de/api2u/homepage'
  ).loadJSON();

const widget = await createWidget();

if (!config.runsInWidget) {
  await widget.presentMedium();
} else {
  Script.setWidget(widget);
}
Script.complete();

async function createWidget() {
  let listWidget = new ListWidget();
  let gradient = new LinearGradient()
  gradient.locations = [0, 1]
  gradient.colors = [
    new Color("141414"),
    new Color("13233F")
  ]
  listWidget.backgroundGradient = gradient

  listWidget.setPadding(15, 15, 15, 7);

  listWidget = await createHeaderImage(listWidget);

  listWidget.addSpacer(10);
  
  let maxArticle = tagesschauData.news.length

  listWidget = await createArticle(listWidget, tagesschauData.news[getRandomInt(0, maxArticle)]);

  return listWidget;
}

async function createArticle(listWidget, data) {
  const { title, shareURL } = data;
  const date = new Date(data.date);

// this used to read the "ressort", but instead the "topline" became vital part of the title in the new version of the news organisation's layout

  let { topline } = data;
  if (topline == undefined) {
    topline = 'Sonstiges';
  }

  listWidget.url = shareURL;

  listWidget.addSpacer(20);

  const article = listWidget.addStack();

// const image used to be higher. It's in this try block now because when the news organisation pushes a breaking news, they don't add an image, causing the widget to produce an error message. This block checks wether there's an image and if not uses a generic "breaking news" image as that seems to be the only case when they don't add an image.

try {
  const image = data.teaserImage.imageVariants['16x9-1280'];
  const articleImage = article.addImage(await loadImage(image));
articleImage.cornerRadius = 5;
}
catch (e) { const articleImage = article.addImage(await loadImage('https://unsplash.com/de/fotos/verschiedene-beschilderungen-in-graustufenfotografie-9-QUC4fm8Lo'
));
articleImage.cornerRadius = 5;
}

  
  article.addSpacer(10);

  const articleInfo = article.addStack();
  articleInfo.layoutVertically();

  const articleTopline = articleInfo.addText(
    topline.charAt(0).toUpperCase() + topline.slice(1)
  );
  articleTopline.textColor = Color.orange();
  articleTopline.font = Font.semiboldMonospacedSystemFont(12);
  articleTopline.minimumScaleFactor = 0.5;

  const articleTitle = articleInfo.addText(title.replaceAll('+', '').trim());
  articleTitle.textColor = Color.white();
  articleTitle.font = Font.headline();
  articleTitle.minimumScaleFactor = 0.1;
  
  const articleDate = articleInfo.addText(formatDate(date));
  articleDate.font = Font.semiboldMonospacedSystemFont(12);
  articleDate.textOpacity = 0.7;
  articleDate.textColor = Color.white()

  listWidget.addSpacer(10);

  return listWidget;
}

// this used to be another image that's no longer online
async function createHeaderImage(listWidget) {
  

  return listWidget;
}
async function loadImage(url) {
  return await new Request(url).loadImage();
}

function formatDate(dateObject) {
  return `${leadingZero(dateObject.getDate())}.${leadingZero(
    dateObject.getMonth() + 1
  )}.${dateObject.getFullYear()}, ${leadingZero(
    dateObject.getHours()
  )}:${leadingZero(dateObject.getMinutes())} Uhr`;
}

function leadingZero(input) {
  return ('0' + input).slice(-2);
}




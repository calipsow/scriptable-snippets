// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: deep-green; icon-glyph: graduation-cap;
const { log, error, warn } = console
const lang = "en" // use the language of your choice "en", "de", "it", "fr", etc.
const dateTime = new Date();
const { month, year, day } = getRandomPastDate()

// Initiate the API Request
const feedUrl = `https://${lang}.wikipedia.org/api/rest_v1/feed/featured/${year}/${month}/${day}`
const req = new Request(feedUrl)
const res = await req.loadJSON()

const onThisDay = res.onthisday[0].pages[0]
const thumbnail = onThisDay.thumbnail ? onThisDay.thumbnail.source : "https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Wikipedia-logo-v2.svg/440px-Wikipedia-logo-v2.svg.png"

// Loads a fallback IMG incase there is no one given
const i = new Request(thumbnail)
const img = await i.loadImage();

// preps meta data 
const time = `Last updated: ${
  new Date(onThisDay.timestamp).toLocaleDateString()
}`

// creating the base widget
let widget = createWidget(
  onThisDay.normalizedtitle, 
  img, 
  onThisDay.content_urls.mobile.page, 
  onThisDay.description,
  onThisDay.extract,
  time
)

// Checks the widget launch size
if (config.runsInWidget) {
  Script.setWidget(widget)
  Script.complete()
} else {
  widget.presentLarge()
}

// Setting up and asemble components
function createWidget(
  title, 
  img, 
  widgeturl, 
  description,
  extracted,
  timestamp
){
  
  // Helper method to config caption texts
  const setCaption = function(caption){
    caption.textColor = Color.lightGray()
    caption.leftAlignText()
    caption.font = Font.thinMonospacedSystemFont(12)
    caption.minimumScaleFactor = 1
  }
  
  const w = new ListWidget()
  const vPad = 15, hPad = 20;
  w.setPadding(vPad, hPad, vPad, hPad)
  
  // returns image instamce after its added
  let image = w.addImage(img)
  image.applyFittingContentMode()
  image.containerRelativeShape = true
  image.cornerRadius = 90
  image.resizable = true
  image.centerAlignImage()
  // sets space between the next comp
  w.addSpacer(11)
  
  // Article title
  let titleTxt = w.addText(title)
  titleTxt.textColor = Color.white()
  titleTxt.lineLimit = 2
  titleTxt.font = Font.blackMonospacedSystemFont(19)
  titleTxt.leftAlignText()

  // Article preview description
  let descTxt = w.addText(description)
  descTxt.textColor = Color.white()
  descTxt.lineLimit = 3
  descTxt.font = Font.mediumMonospacedSystemFont(14)
  descTxt.leftAlignText()
  
  // Caption text with meta data
  let timeTxt = w.addText(timestamp)
  setCaption(timeTxt)
  w.addSpacer(8)
  
  // Main article content 
  let articleTxt = w.addText(extracted)
  articleTxt.textColor = Color.white()
  articleTxt.font = Font.lightRoundedSystemFont(12)
  articleTxt.leftAlignText()
  articleTxt.lineLimit = 10
  
  // URL which onclick, the widget redirects to
  w.url = widgeturl

  return w
}

// Generates random past date of the year
// { day: str, month: str, year: str }
function getRandomPastDate() {
    const now = new Date();
    const lastYear = now.getFullYear() - 1;
    const randomDate = new Date(lastYear, 0, 1 + Math.floor(Math.random() * 365));
    const formatWithZero = (num) => num.toString().padStart(2, '0');
    return {
        day: formatWithZero(randomDate.getDate()),
        month: formatWithZero(randomDate.getMonth() + 1),
        year: randomDate.getFullYear().toString()
    };
}


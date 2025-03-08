// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: gray; icon-glyph: magic;




/*
  Creates an Widget which displays the 
  newest memes and posts from subreddits 
  you like.

*/
const { log, warn, error } = console
const API_ENDPOINT = "https://meme-api.com/gimme"

// list here the subreddits you want to 
// see. r/garmany -> "/germany"

// this script will randomly choose from which 
// of the subreddits the newest meme
// are get loaded.
const subreddits = ["/ich_iel", "/meme", "/place"]

const requestApi = async () => {
  const sub = subreddits[Math.floor(Math.random() * (subreddits.length - 1))]
  const resp = await new Request(API_ENDPOINT + sub).loadJSON()
  const {
    title, postLink, url,
    author, subreddit, ups,
    spoiler
  } = resp
  
  return {
    title, postLink, url,
    author, subreddit, ups, spoiler
  }
}

const createWidget = (
  title, 
  img, 
  widgeturl, 
  description,
  upvotes
) => {
  
  const setCaption = (caption) => {
    caption.textColor = Color.lightGray()
    caption.leftAlignText()
    caption.font = Font.boldSystemFont(9)
    caption.minimumScaleFactor = 1
  }
  
  let w = new ListWidget()
  let gradient = new LinearGradient()
  gradient.locations = [3, 1]
  gradient.colors = [
    new Color("#141414"),
    new Color("#13233F")
  ]
  w.backgroundGradient = gradient
  
  const verticalPad = 20, horizontalPad = 20;
  
  w.setPadding(
    verticalPad, 
    horizontalPad, 
    verticalPad, 
    horizontalPad
  )
  
  let image = w.addImage(img)
  image.applyFittingContentMode()
  image.containerRelativeShape = true
  image.cornerRadius = 90
  image.resizable = true
  image.centerAlignImage()
  
  w.addSpacer(16)
  
  let titleTxt = w.addText(title)
  titleTxt.textColor = Color.white()
  titleTxt.font = Font.blackMonospacedSystemFont(19)
  titleTxt.leftAlignText()

  w.addSpacer(1)

  let descTxt = w.addText(description)
  descTxt.textColor = Color.white()
  descTxt.font = Font.thinMonospacedSystemFont(11)
  descTxt.leftAlignText()
  
  w.addSpacer(10)
  
  let ups = w.addText(upvotes)
  ups.textColor = Color.lightGray()
  ups.font = Font.boldMonospacedSystemFont(14)
  ups.leftAlignText()
  
  w.url = widgeturl

  return w
}


(async function(){
  const meme = await requestApi()
  const image = await new Request(meme.url).loadImage()
  
  const widget = createWidget(
    meme.title,
    image,
    meme.postLink,
    `@${meme.author} in r/${meme.subreddit}${meme.spoiler === true ? " Spoiler" : ""}`,
    `${meme.ups} Upvotes`
  )
  
  if (config.runsInWidget) {
    // create and show widget
    Script.setWidget(widget)
    Script.complete()
  }
  else {
    widget.presentLarge()
  }
})()


var zIndex = 1
const body = document.body

protoMatter.querySelectorAll('.corner')
  .forEach(corner => {
    corner.onmousedown = corner.ontouchstart = dragInit
    corner.ondragstart = evt => evt.preventDefault()
  } )

function dragInit(evt) {
  const style = this.parentNode.style
  style.zIndex = zIndex++
  this.style.cursor = 'grabbing'
  body.onmousemove = body.ontouchmove = evt => drag(evt, this)
  body.onmouseup = body.ontouchend = evt => dragEnd(evt, this)
}

function drag(evt, corner) {
  const cornerClass = corner.classList,
        subj = corner.parentNode,
        style = subj.style, subStyle = subj.sub.style
        brd = style.borderWidth,
      { x, y, width, height } = subj.getBoundingClientRect()
  switch (true) {
    case cornerClass.contains('nw'):
      style.width = subStyle.width = width - (evt.x - x) + 'px'
      style.left = subStyle.left =  evt.x + 'px'
      style.height = subStyle.height = height - (evt.y - y) + 'px'
      style.top = subStyle.top = evt.y + 'px'
      break
    case cornerClass.contains('ne'):
      style.width = subStyle.width = evt.x - x + 'px'
      style.left = subStyle.left = Math.min(evt.x, x) + 'px'
      style.height = subStyle.height = height - (evt.y - y) + 'px'
      style.top = subStyle.top = evt.y + 'px'
      break
    case cornerClass.contains('sw'):
      style.width = subStyle.width = width - (evt.x - x) + 'px'
      style.left = subStyle.left = evt.x + 'px'
      style.height = subStyle.height = evt.y - y + 'px'
      style.top = subStyle.top = Math.min(evt.y, y) + 'px'
      break
    case cornerClass.contains('se'):
      style.width = subStyle.width = evt.x - x + 'px'
      style.left = subStyle.left = Math.min(evt.x, x) + 'px'
      style.height = subStyle.height = evt.y - y + 'px'
      style.top = subStyle.top = Math.min(evt.y, y) + 'px'
  }
}

function dragEnd(evt, el) {
  body.ontouchmove = body.ontouchend = body.onmousemove = body.onmouseup = null
  el.style.cursor = null
}


const box = body.querySelector('.box')

function evolve(el) {
  el.sub = document.createElement('div')
  for (child of el.childNodes) el.sub.append(child)
  el.appendChild(el.sub).className = 'sub';
  ['nw','ne','sw','se'].forEach(side => 
    el.appendChild(document.createElement('div')).className = 'corner '+side
  )
  el.classList.add('matter')
  const color = getComputedStyle(el).backgroundColor
  el.style.borderColor = color
  el.querySelectorAll('.corner').forEach(corner => {
    corner.onmousedown = dragInit
    corner.ondragstart = evt => evt.preventDefault()
    corner.style.borderColor = color
  } )
  
}

evolve(box)
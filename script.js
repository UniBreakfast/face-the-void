var zIndex = 1
const body = document.body

function dragInit(evt) {
  const style = this.parentNode.style
  style.zIndex = zIndex++
  this.style.cursor = 'grabbing'
  this.classList.add('no-select')
  body.onmousemove = body.ontouchmove = evt => drag(evt, this)
  body.onmouseup = body.ontouchend = evt => dragEnd(evt, this)
}

function drag(evt, corner) {
  const cornerClass = corner.classList,
    subj = corner.parentNode,
    style = subj.style, subStyle = subj.sub.style
  // { x, y, width, height } = subj.getBoundingClientRect() // it lies!
  var { left: x, top: y, width, height } = getComputedStyle(subj);
  [x, y, width, height] = [x, y, width, height].map(val => parseInt(val))
  switch (true) {
    case cornerClass.contains('nw'):
      style.width = subStyle.width = width - (evt.pageX - x) + 'px'
      style.left = subStyle.left = evt.pageX + 'px'
      style.height = subStyle.height = height - (evt.pageY - y) + 'px'
      style.top = subStyle.top = evt.pageY + 'px'
      break
    case cornerClass.contains('ne'):
      style.width = subStyle.width = evt.pageX - x + 'px'
      style.left = subStyle.left = Math.min(evt.pageX, x) + 'px'
      style.height = subStyle.height = height - (evt.pageY - y) + 'px'
      style.top = subStyle.top = evt.pageY + 'px'
      break
    case cornerClass.contains('sw'):
      style.width = subStyle.width = width - (evt.pageX - x) + 'px'
      style.left = subStyle.left = evt.pageX + 'px'
      style.height = subStyle.height = evt.pageY - y + 'px'
      style.top = subStyle.top = Math.min(evt.pageY, y) + 'px'
      break
    case cornerClass.contains('se'):
      style.width = subStyle.width = evt.pageX - x + 'px'
      style.left = subStyle.left = Math.min(evt.pageX, x) + 'px'
      style.height = subStyle.height = evt.pageY - y + 'px'
      style.top = subStyle.top = Math.min(evt.pageY, y) + 'px'
  }
  subj.sub.classList[['remove', 'add'][
    +[style.width, style.height].some(val => parseInt(val) < 30)]]('toosmall')
}

function dragEnd(evt, el) {
  body.ontouchmove = body.ontouchend = body.onmousemove = body.onmouseup = null
  el.style.cursor = null
  el.classList.remove('no-select')
}


const box = body.querySelector('.box')

function evolve(el) {
  const { x, y, width, height } = el.getBoundingClientRect()
  el.sub = document.createElement('div')
  for (child of el.childNodes) el.sub.append(child)
  el.appendChild(el.sub).className = 'sub in';
  ['nw', 'ne', 'sw', 'se'].forEach(side =>
    el.appendChild(document.createElement('div')).className = 'corner ' + side
  )
  el.classList.add('box', 'out')
  Object.assign(el.style,
    { padding: 0, margin: 0, left: x + 'px', top: y + 'px' })
  const style = el.sub.style
  style.width = width + 'px', style.height = height + 'px'
  const color = getComputedStyle(el).backgroundColor
  el.style.borderColor = color
  el.querySelectorAll('.corner').forEach(corner => {
    corner.onmousedown = dragInit
    corner.ondragstart = evt => evt.preventDefault()
    // corner.style.borderColor = color
  })

}

evolve(box)
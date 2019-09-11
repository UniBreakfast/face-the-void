{
  const d = document, b = d.body;
  
  [...b.children].forEach(elt => {
    const eltBg = getComputedStyle(elt).backgroundColor
    elt.style.background = eltBg == 'rgba(0, 0, 0, 0)' ? 
      getComputedStyle(b).backgroundColor : eltBg
  })

  b.classList.add('void')

  fetch('the-void.css').then(res => res.text()).then(css =>
    d.head.appendChild(d.createElement('style')).innerHTML = css)
}
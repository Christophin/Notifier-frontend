import React from 'react'
import troll from '../images/Troll-Face.png'

export default function Meme() {
  const [meme, setMeme] = React.useState({
    topText: "",
    bottomText: "",
    randomImage: "http://i.imgflip.com/1bij.jpg"
  })

  const [allMemes, setAllMemes] = React.useState([])
  console.log("inside memes")
  React.useEffect(() => {
    fetch("https://api.imgflip.com/get_memes")
      .then(res => res.json())
      .then(res => setAllMemes(res.data.memes)
    )
  }, [])

  function handleClick(e) {
    e.preventDefault();
    const randomNum = Math.floor(Math.random()*allMemes.length)
    setMeme(prev => {
      return {
        ...prev,
        randomImage: allMemes[randomNum].url
      }
    })
  }

  function handleChange(e) {
    const {name, value} = e.target
        setMeme(prev => {
            return {
                ...prev,
                [name]: value
            }
        })
  }

  return (
    <main>
      <div className="header">
        <img
          className="header-img"
          src={troll}
          alt="troll"
        />
        <span className="header-title">Meme Generator</span>
      </div>
      <div className="form">
        <input
          className="form-input"
          type="text"
          placeholder="Top text"
          name="topText"
          value={meme.topText}
          onChange={handleChange}
          />
        <input
          className="form-input"
          type="text"
          placeholder="Bottom text"
          name="bottomText"
          value={meme.bottomText}
          onChange={handleChange}
        />
        <button onClick={handleClick} className="form-button" >Get a new meme image  🖼</button>
      </div>
      <div className="meme">
                <img src={meme.randomImage} className="meme-image" alt="meme" />
                <h2 className="meme-text top">{meme.topText}</h2>
                <h2 className="meme-text bottom">{meme.bottomText}</h2>
      </div>
    </main>
  )
}

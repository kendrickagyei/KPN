mountComponent('hero-component', `
  <section class="hero" id="watch">
    <div class="hero-glow" aria-hidden="true"></div>
    <div class="hero-inner">
      <div class="hero-copy">
        <p class="eyebrow"><span></span> A community of faith</p>
        <h1>Rooted in the Word.<br><em>Alive in purpose.</em></h1>
        <p class="hero-description">
          Welcome to King Priest Nation — a place to grow in faith, encounter God, and walk out your calling together.
        </p>
        <div class="hero-actions">
          <a class="btn-gradient" href="sermons.html">Explore sermons <span aria-hidden="true">↗</span></a>
          <a class="text-link" href="#about">Discover our heart <span aria-hidden="true">→</span></a>
        </div>
        <div class="hero-note">
          <span class="note-mark" aria-hidden="true">✦</span>
          <span>Faith. Worship. Purpose.</span>
        </div>
      </div>

      <div class="hero-visual">
        <div class="hero-photo-wrap">
          <img
            class="hero-photo"
            src="Images/photo_10_hero_sharp.jpg"
            alt="A minister sharing a message at the pulpit"
            fetchpriority="high">
          <div class="photo-shade" aria-hidden="true"></div>
          <div class="photo-caption">
            <span class="caption-kicker">Gather in faith</span>
            <span class="caption-title">Find your place<br>in the story.</span>
          </div>
        </div>
        <div class="hero-seal" aria-hidden="true"><span>KPN</span><small>Faith · Word · Life</small></div>
        <span class="hero-orbit hero-orbit-one" aria-hidden="true"></span>
        <span class="hero-orbit hero-orbit-two" aria-hidden="true"></span>
      </div>
    </div>
    <a class="scroll-cue" href="sermons.html"><span></span> Explore sermons</a>
  </section>
`);

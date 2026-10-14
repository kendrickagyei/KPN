mountComponent('welcome-component', `
  <section class="pastor-intro" aria-labelledby="pastor-name">
    <div class="pastor-inner">
      <div class="pastor-portrait">
        <img
          src="Images/photo_4_2026-10-13_10-04-01.jpg"
          alt="Reverend Gabriel Fleisher"
          loading="lazy">
        <div class="pastor-portrait-caption">
          <span class="pastor-caption-mark" aria-hidden="true">✦</span>
          <span>Faithful service. Lasting impact.</span>
        </div>
      </div>

      <div class="pastor-copy">
        <p class="pastor-eyebrow"><span></span> Meet our pastor</p>
        <h2 id="pastor-name">Reverend Gabriel <em>Fleisher</em></h2>
        <p>
          Reverend Gabriel Fleisher has been serving in ministry since 2008,
          sharing the Word and encouraging people in their walk of faith.
        </p>
        <p>
          Through his ministry, he has mentored individuals across the world,
          helping them grow in faith and pursue their God-given calling.
        </p>
        <div class="pastor-ministry-note">
          <span class="pastor-note-line" aria-hidden="true"></span>
          <span><strong>In ministry since 2008</strong><br>Serving and mentoring across the world</span>
        </div>
        <a class="pastor-link" href="#about">Discover our heart <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
`);

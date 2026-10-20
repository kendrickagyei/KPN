mountComponent('header-component', `
  <header class="site-header" id="top">
    <div class="header-inner">
      <a class="brand" href="index.html#top" aria-label="King Priest Nation home">
        <img class="brand-logo" src="logo.png" alt="" width="64" height="58">
        <span class="brand-name">King Priest Nation</span>
      </a>

      <button class="menu-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
        <span></span><span></span><span></span>
      </button>

      <nav class="site-nav" id="site-nav" aria-label="Main">
        <ul>
          <li><a href="index.html#watch">Watch live</a></li>
          <li><a href="sermons.html">Sermons</a></li>
          <li><a href="events.html">Events</a></li>
          <li><a href="announcements.html">Announcements</a></li>
          <li><a href="index.html#ministries">Ministries</a></li>
          <li><a href="index.html#about">About</a></li>
          <li><a href="index.html#give">Give</a></li>
          <li><a href="index.html#contact">Contact</a></li>
        </ul>
        <a class="btn-gold nav-cta" href="index.html#watch">Join us</a>
      </nav>
    </div>
  </header>
`);

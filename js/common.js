function headerLoader(showLang=true) {
  return {
    content: '',
    loadContent: async function() {
      try {
        const filename = showLang ? "header.html" : "header-no-lang.html";
        let response = await fetch(`./partials/${filename}`);
        if (!response.ok) throw new Error('Failed to fetch content');
        this.content = await response.text();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}


function personalNavLoader() {
  return {
    content: '',
    loadContent: async function() {
      try {
        const filename = "personal-nav.html"
        let response = await fetch(`./partials/${filename}`);
        if (!response.ok) throw new Error('Failed to fetch content');
        this.content = await response.text();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}

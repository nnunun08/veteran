function headerLoader() {
  return {
    content: '',
    loadContent: async function() {
      try {
        let response = await fetch('./partials/header.html');
        if (!response.ok) throw new Error('Failed to fetch content');
        this.content = await response.text();
      } catch (error) {
        console.error('Error:', error);
      }
    }
  }
}

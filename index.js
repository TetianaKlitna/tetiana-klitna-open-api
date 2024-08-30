fetch('https://api.github.com/users/TetianaKlitna/repos')
  .then(response => {
    if (!response.ok) {
      throw new Error('Request failed');
    }
    return response.json(); 
  })
  .then(data => {
    const projectsSection = document.getElementById("projects");
    let projectsList = projectsSection.querySelector("ul");
    projectsList.style.listStyle = 'none';
    for(let i = 0; i < data.length; i++){
            let newProject = document.createElement("li");
            newProject.innerHTML = `<a href = '${data[i].html_url}'>${data[i].name}</a>`;
            projectsList.appendChild (newProject);
            console.log(`${data[i].name} saccessfully added.`)
    }
  })
  .catch(error => {
    console.error('An error occurred:', error);
  });
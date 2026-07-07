(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get("id");

  const titleElement = document.getElementById("photo-title");
  const galleryElement = document.getElementById("photo-gallery");
  const prevLink = document.getElementById("photo-prev");
  const nextLink = document.getElementById("photo-next");

  if (typeof photographyProjects === "undefined") {
    console.error("photographyProjects is not defined. Check photography-data.js.");
    return;
  }

  const project = photographyProjects[projectId];

  if (!titleElement) {
    console.error("Missing element: #photo-title");
    return;
  }

  if (!galleryElement) {
    console.error("Missing element: #photo-gallery");
    return;
  }

  if (!project) {
    console.error(`Project not found: ${projectId}`);
    titleElement.textContent = "Photography project not found";
    return;
  }

  document.title = `${project.title} | Ji Long Portfolio`;
  titleElement.textContent = project.title;

  galleryElement.innerHTML = "";

  project.images.forEach((imageSrc, index) => {
    const figure = document.createElement("figure");
    figure.className = "photo-detail__image";

    const image = document.createElement("img");
    image.src = imageSrc;
    image.alt = `${project.title} ${index + 1}`;

    figure.appendChild(image);
    galleryElement.appendChild(figure);
  });

  const projectIds = Object.keys(photographyProjects);
  const currentIndex = projectIds.indexOf(projectId);

  if (currentIndex === -1) {
    console.error(`Current project id is not in photographyProjects: ${projectId}`);
    return;
  }

  const prevProjectId =
    currentIndex > 0
      ? projectIds[currentIndex - 1]
      : projectIds[projectIds.length - 1];

  const nextProjectId =
    currentIndex < projectIds.length - 1
      ? projectIds[currentIndex + 1]
      : projectIds[0];

  if (prevLink) {
    prevLink.href = `photography-detail.html?id=${prevProjectId}`;
  }

  if (nextLink) {
    nextLink.href = `photography-detail.html?id=${nextProjectId}`;
  }
})();
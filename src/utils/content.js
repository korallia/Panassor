export function getPageText(content, language = "fr", path = "") {
  const languageContent = content[language] || content.fr;

  if (!path) {
    return languageContent;
  }

  return (
    path
      .split(".")
      .reduce((currentValue, key) => currentValue?.[key], languageContent) || ""
  );
}
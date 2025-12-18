const slugCreate = (text: string) => {
  return text.toLowerCase().replace(/ /g, "-");
};

export default slugCreate;

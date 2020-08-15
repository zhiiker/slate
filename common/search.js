createUserSearchResult = (user) => {
  return {
    id: user.id,
    type: "user",
    name: user.data.name,
    username: user.username,
    url: user.data.photo,
  };
};

createSlateSearchResult = (slate, username) => {
  let files;
  if (slate.data.objects.length > 3) {
    files = slate.data.objects.slice(0, 3);
  } else {
    files = slate.data.objects;
  }
  return {
    id: slate.id,
    type: "slate",
    name: slate.slatename,
    username: username,
    url: files.map((file) => {
      return {
        type: file.type
          ? file.type.includes("image")
            ? "image"
            : "file"
          : "file",
        url: file.url,
      };
    }),
  };
};

createFileSearchResult = (file, username) => {
  return {
    id: file.id,
    type: file.type ? (file.type.includes("image") ? "image" : "file") : "file",
    name: file.name,
    username: username,
    url: file.url,
  };
};

require("aeonian")
  .config({
    bucket: {
      localDir: "./build",
      prefix: "app.onawa.me-"
    },
    environments: {
      live: "E1BGK6UH8WNLS3",
      sandbox: "E2R67HWWEJULAM"
    }
  })
  .deploy(process.argv[2]);

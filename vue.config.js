module.exports = {
  css: {
    loaderOptions: {
      sass: {
        // always import main.scss first
        data: '@import "@/main.scss";',
      },
    },
  },
};

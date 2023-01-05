const style = {
  primaryClient: "#0489cc",
  primaryClientHover: "#2f6784",
  primaryClient90: "#0589cbe6",
  secondaryClient: "#086899",
  secondaryClientHover: "#084767"
};

const theme = `
  :root{
    --primaryClient: ${style.primaryClient};
    --primaryClientHover: ${style.primaryClientHover};
    --primaryClient90: ${style.primaryClient90};
    --secondaryClient: ${style.secondaryClient};
    --secondaryClientHover: ${style.secondaryClientHover};
  }
`;

const useTheme = callback => {
  const style = document.createElement("style");
  style.type = "text/css";

  const setTheme = () => {
    style.appendChild(document.createTextNode(theme));
    document.head.prepend(style);
    return style;
  };

  return {
    setTheme
  };
};

export default useTheme;

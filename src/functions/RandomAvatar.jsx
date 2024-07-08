import PropTypes from "prop-types";
const Avatar = () => {
  const getRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getRandomCharacter = () => {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    return characters[Math.floor(Math.random() * characters.length)];
  };

  return (
    <img
      src={`https://robohash.org/${getRandomCharacter()}.png?size=60x60`}
      className="rounded-full"
      style={{ backgroundColor: getRandomColor()}}
      alt="avatar.png"
    />
  );
};
Avatar.propTypes = {
  size: PropTypes.number,
};


export default Avatar;

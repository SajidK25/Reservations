interface ProfilePictureProps {
  size?: "small" | "large";
}

export default function ProfilePicture({
  size = "small",
}: ProfilePictureProps) {
  const classes =
    size === "large"
      ? "w-24 h-24 rounded-full object-cover" // veći avatar
      : "w-full h-full object-cover"; // mali avatar

  return <img src="/profile.jpg" alt="Profile" className={classes} />;
}

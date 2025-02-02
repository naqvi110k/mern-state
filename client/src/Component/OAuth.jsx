import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export const OAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app); // Initialize auth with the app instance

      const result = await signInWithPopup(auth, provider);
      // Correct order of arguments
      console.log(result);

      const response = await axios.post("/api/auth/google", {
        name: result.user.displayName,
        avatar: result.user.photoURL,
        email: result.user.email,
      });
      dispatch(signInSuccess(response.data.rest));
      navigate("/");
    } catch (error) {
      console.error("Error during Google OAuth", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-95"
    >
      continue with google
    </button>
  );
};
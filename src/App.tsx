import { Route, Routes } from "react-router";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import CreatePost from "./pages/CreatePost";
import Communities from "./pages/Communities";
import CreateCommunity from "./pages/CreateCommunity";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { supabase } from "./supabase-client";
import PostPage from "./pages/PostPage";
import Community from "./pages/Community";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        useAuthStore.setState({ user: data.session?.user });
      }
    };
    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) =>
      useAuthStore.setState({ user: session?.user ?? null })
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <div>
      <Navbar />
      <ScrollToTop />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/communities" element={<Communities />} />
          <Route path="/community/create" element={<CreateCommunity />} />
          <Route path="/community/:id" element={<Community />} />
          <Route path="/post/:id" element={<PostPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;

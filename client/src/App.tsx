import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Scheduler from "./pages/Scheduler";
import Accounts from "./pages/Accounts";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import AIComposer from "./pages/AIComposer";
import Feedback from "./pages/Feedback";
import { Toaster } from "react-hot-toast";

export default function App() {
    return (
        <>
        <Toaster position="top-right" />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/scheduler" element={<Scheduler />} />
                    <Route path="/feedback" element={<Feedback />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/ai-composer" element={<AIComposer />} />
                </Route>
            </Routes>
        </>
    );
}
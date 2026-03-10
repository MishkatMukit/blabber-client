import Banner from "../../Components/HomeComponents/Banner";
import useAuth from "../../Hooks/useAuth";

const Home = () => {
    const {user} = useAuth()
    console.log(user);
    return (
        <div className="pt-16">
            <Banner></Banner>
        </div>
    );
};

export default Home;
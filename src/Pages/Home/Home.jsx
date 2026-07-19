import { Helmet } from "react-helmet-async";
import Banner from "../../Components/HomeComponents/Banner";

const Home = () => {
    return (
        <div className="pt-16">
            <Helmet><title>Blabber-Home</title></Helmet>
            <Banner></Banner>
        </div>
    );
};

export default Home;
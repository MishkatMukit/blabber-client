import { Link } from 'react-router';
import b404 from "../../assets/blabber3-404.png"
const Error = () => {
    return (
        <div className='flex flex-col text-center items-center justify-center'>
            {/* <Helmet>
                <title>Hired | Error</title>
            </Helmet> */}
            <div>
                <img className='rounded-xl max-w-3xl' src={b404} alt="" />
            </div>
            <div className='space-y-1 p-5'>
                <div className='text-md font-medium'>
                    <p className='text-xl text-primary'>The blab has gone silent.</p>
                    <p className='text-sm font-light text-base-200'>We couldn't find the blab you were looking for. It might have been deleted, or perhaps it never echoed in the first place.</p>
                </div>
            </div>
            <Link to="/"><button className='btn btn-primary mt-2 bg-primary text-white font-bold rounded-full'>Back to Home</button></Link>
        </div>
    );
};

export default Error;
import { currentUser } from "@clerk/nextjs/server";

const Dashboard = async () => {

    const user = await currentUser();
    return (
        <div className="flex items-center justify-center hc text-center ">
             <h2 className="text-lg font-meduim"> 
                Hello {user?.firstName}
             </h2>
        </div>
    );
}

export default Dashboard;
export const sendLogEmail = async({to,subject,text})=>{
    console.log('Email simulated');

    return {
        success:true,
        transport: 'log'
    };
}

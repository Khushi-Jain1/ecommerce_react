getMessage = () => {
    try {
        let response = await axiosInstance.get('/hello/');
        const message = response.data.hello;
        this.setState({
            message: message,
        });
        return message;
    }catch(error){
        console.log("Error: ", JSON.stringify(error, null, 4));
        throw error;
    }
}
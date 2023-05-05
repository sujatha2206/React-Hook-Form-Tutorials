import { TextField,Button,Stack } from "@mui/material";
import {useForm} from 'react-hook-form';
import { DevTool } from "@hookform/devtools";

type formValues={
    email:string,
    password:string
}
export const MuiLoginForm=()=>{
    const form=useForm<formValues>({
        defaultValues:{
            email:'suji@gmail.com',
            password:''
        }
    });
    const {register,handleSubmit,formState:{errors},control}=form;
    const submitHandler=(data:formValues)=>{
        console.log(data);
    }
    return(
        <>
        <h1>Login</h1>
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
            <Stack spacing={2} width={400}>
            <TextField label="Email" type="email" {...register('email',{required:{value:true,message:'Email is required'}})} error={!!errors.email} helperText={errors.email?.message}/>
            <TextField label="Password" type="password" {...register('password',{required:'Password is required'})} error={!!errors.password} helperText={errors?.password?.message}/>
            <Button type="submit" variant="contained" color="primary">Login</Button>
            </Stack>

        </form>
        <DevTool control={control}/>
        </>
    )
}
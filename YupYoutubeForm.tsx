import React, { useEffect } from 'react'
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from "@hookform/devtools";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
let renderCount = 0;
type formValues = {
  username: string,
  email: string,
  channel: string,
 
}
const schema=yup.object({
    username:yup.string().required('Username is required'),
    email:yup.string().email("Email is invalid").required('email is required'),
    channel:yup.string().required('Channel is required')
})
export const YoutubeForm = () => {
  const form = useForm<formValues>({
    defaultValues: {
      username: 'sujatha',
      email: 'suji@gmail.com',
      channel: '',
     
    },
    resolver:yupResolver(schema)
  });

  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
 
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;
  const watchField = watch();
  renderCount++;

  const onSubmit = (data: formValues) => {
    console.log("form submmited", data);

  }
  const onError = (errors: FieldErrors<formValues>) => {
    //best place,we can provide custom error messages or even send reports to logging service
    console.log("form errors", errors);
  }
 

  //<input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} />
  return (
    <div>
      {/* <h2>{JSON.stringify(watchField)}</h2> */}
      <h2>form does not rerender for every control change{renderCount / 2}</h2> //during dev in stricct mode react render twice
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor='username'>Username</label>
          <input type="text" id="username" {...register('username')} />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='email'>Email</label>
          <input type="text" id="email" {...register('email')} />
          <p className='error'>{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='chaneel'>Channel</label>
          <input type="text" id="chaneel"  {...register('channel')} />
          <p className="error">{errors.channel?.message}</p>
        </div>

        
        <button type="submit" >Submit</button>
       
      </form>
      <DevTool control={control} />
    </div>
  )
}

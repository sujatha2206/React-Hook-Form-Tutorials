import React, { useEffect } from 'react'
import { useForm, useFieldArray, FieldErrors } from 'react-hook-form';
import { DevTool } from "@hookform/devtools";
let renderCount = 0;
type formValues = {
  username: string,
  email: string,
  channel: string,
  social: {
    twitter: string,
    facebook: string
  },
  phoneNumbers: Array<string>,
  phNumbers: { number: string }[],
  age: number,
  date: Date
}
export const YoutubeForm = () => {
  const form = useForm<formValues>({
    defaultValues: {
      username: 'sujatha',
      email: 'suji@gmail.com',
      channel: '',
      social: {
        twitter: '',
        facebook: ''
      },
      phoneNumbers: ['', ''],
      phNumbers: [{ number: '' }],
      age: 0,
      date: new Date()
    },
    mode: 'all'
  });
  //phNumbers dynamic fields
  // const form =useForm<formValues>({
  //   defaultValues:async function(){
  //     let response=await fetch('https://jsonplaceholder.typicode.com/users/1');
  //     let data=await response.json();
  //     return{
  //       username:'sujatha',
  //       email:data['email'],
  //       channel:''
  //     }
  //   }
  // })
  //unlike watch getvalue will not trigger rerenders and get form values only click on button
  const { register, control, handleSubmit, formState, watch, getValues, setValue, reset, trigger } = form;
  const { fields, append, remove } = useFieldArray({
    name: 'phNumbers',
    control
  })
  const { errors, touchedFields, dirtyFields, isDirty, isValid, isSubmitting, isSubmitted, isSubmitSuccessful, submitCount } = formState;
  const watchField = watch();
  renderCount++;
  //const {name,ref,onChange,onBlur} =register('username');
  console.log({ isSubmitting, isSubmitted, isSubmitSuccessful, submitCount });
  console.log({ touchedFields, dirtyFields, isDirty });
  const onSubmit = (data: formValues) => {
    console.log("form submmited", data);

  }
  const onError = (errors: FieldErrors<formValues>) => {
    //best place,we can provide custom error messages or even send reports to logging service
    console.log("form errors", errors);
  }
  const handleGetValues = () => {
    console.log(getValues(['social', 'age']));
  }
  //calling set values does not chnage dirty and touched state if we want we need to pause 3rd argumnets
  const handleSetValues = () => {
    setValue('username', '', { shouldDirty: true, shouldTouch: true, shouldValidate: true })
  }
  useEffect(() => {
    const subscription = watch((value) => {
      console.log(value);
    })
    return () => subscription.unsubscribe()

  }, [watch]);
  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset])
  //<input type="text" id="username" name={name} ref={ref} onChange={onChange} onBlur={onBlur} />
  return (
    <div>
      {/* <h2>{JSON.stringify(watchField)}</h2> */}
      <h2>form does not rerender for every control change{renderCount / 2}</h2> //during dev in stricct mode react render twice
      /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <div className="form-control">
          <label htmlFor='username'>Username</label>
          <input type="text" id="username" {...register('username', { disabled: false, required: { value: true, message: 'username is required' } })} />
          <p className="error">{errors.username?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='email'>Email</label>
          <input type="text" id="email" {...register('email', {
            pattern: { value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: 'Invalid Email format' },
            validate: {
              'notadmin': (fieldValue) => {
                return fieldValue !== 'admin@example.com' || 'Enter a different Email'
              },
              'notBadDomain': (fieldValue) => {
                return !fieldValue.endsWith('baddomain.com') || 'These domain is not supported'
              },
              'emailAlreadyExits': async (fieldValue) => {
                const response = await fetch(`https://jsonplaceholder.typicode.com/users/?email=${fieldValue}`);
                const data = await response.json();
                return data.length === 0 || 'Email already Exists'
              }
            }
          })} />
          <p className='error'>{errors.email?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='chaneel'>Channel</label>
          <input type="text" id="chaneel"  {...register('channel', { required: 'channel is required' })} />
          <p className="error">{errors.channel?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='twitter'>Twitter</label>
          <input type="text" id="twitter" {...register('social.twitter', { disabled: watch('channel') === '', required: { value: true, message: 'Twitter is required' } })} />
          <p className='error'>{errors?.social?.twitter?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='facebook'>Facebook</label>
          <input type="text" id="facebook" {...register('social.facebook', { required: 'facebook is required' })} />
          <p className='error'>{errors?.social?.facebook?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='primary-phone'>Primary Phone Number</label>
          <input type="text" id="primary-phone" {...register('phoneNumbers.0', { required: { value: true, message: 'Primary phoneno is required' } })} />
          <p className='error'>{errors?.phoneNumbers?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='secondary-phone'>Secondary Phone Number</label>
          <input type="text" id="secondary-phone" {...register('phoneNumbers.1', { required: { value: true, message: 'Secondary phone number is required' } })} />
          <p className='error'>{errors?.phoneNumbers?.message}</p>
        </div>
        <div>
          <label>List of Phone Numbers</label>
          {fields.map((field, index) => {
            return (
              <div className='form-control' key={field.id}>
                <input type="text" {...register(`phNumbers.${index}.number` as const)} />
                {index > 0 && <button type="button" onClick={() => remove(index)}>Remove</button>}
              </div>
            )
          })}
          <button type="button" onClick={() => append({ number: '' })}>Add Phonenumber</button>
        </div>
        <div className="form-control">
          <label htmlFor='age'>Age</label>
          <input type="number" id="age" {...register('age', { valueAsNumber: true, required: { value: true, message: 'age is required' } })} />
          <p className="error">{errors.age?.message}</p>
        </div>
        <div className="form-control">
          <label htmlFor='date'>date</label>
          <input type="date" id="date" {...register('date', { valueAsDate: true, required: { value: true, message: 'date is required' } })} />
          <p className="error">{errors.date?.message}</p>
        </div>
        <button type="submit" onClick={() => reset()}>Reset</button>
        <button type="button" onClick={handleGetValues}>Get Values</button>
        <button type="button" onClick={handleSetValues}>Set Values</button>
        <button type="submit" disabled={!isDirty || !isValid || isSubmitting}>Submit</button>
        <button type="submit" onClick={() => trigger()}>Trigger validation Manually</button>
      </form>
      <DevTool control={control} />
    </div>
  )
}

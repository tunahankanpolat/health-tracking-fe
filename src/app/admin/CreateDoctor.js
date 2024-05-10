import React, { useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { View, TextInput, Text, Pressable } from "react-native";
import toastMessage from "../utils/toastMessage";
import DoctorService from "../services/doctorService";
import { useSession } from "../../ctx";
import { Box, Button, TextField, Typography, AccountCircle } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { IconButton, InputAdornment, Input, FormControl, InputLabel } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { MuiTelInput } from 'mui-tel-input';

const DoctorSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(3, "Name must be between 3 and 20 characters long")
    .max(20, "Name must be between 3 and 20 characters long"),
  surname: Yup.string()
    .required("Surname is required")
    .min(3, "Surname must be between 3 and 20 characters long")
    .max(20, "Surname must be between 3 and 20 characters long"),
  username: Yup.string()
    .required("Username is required")
    .min(3, "Username must be between 3 and 20 characters long")
    .max(20, "Username must be between 3 and 20 characters long"),
  password: Yup.string()
    .required("Password is required")
    .min(3, "Password must be between 3 and 20 characters long")
    .max(20, "Password must be between 3 and 20 characters long"),
  specialization: Yup.string()
    .required("Specialization is required")
    .min(3, "Specialization must be between 3 and 20 characters long")
    .max(20, "Specialization must be between 3 and 20 characters long"),
  phoneNumber: Yup.string()
    .required("Phone number is required")
    .min(11, "Phone number must be between 11 and 11 characters long")
    .max(11, "Phone number must be between 11 and 11 characters long"),
  emailAddress: Yup.string().email("Invalid email"),
  address: Yup.string(),
});

const handleCreation = (token, values) => {
  let doctorService = new DoctorService();
  Object.keys(values).forEach(
    (key) => values[key] === "" && delete values[key]
  );
  doctorService
    .createDoctor(token, values)
    .then((response) => {
      toastMessage("success", response.data);
    })
    .catch((error) => {
      console.log(error.response.data.message);
      toastMessage("error", error.response.data.message);
    });
};

const CreateDoctorForm = () => {
  const { isLoading, session } = useSession();
  const [showPassword, setShowPassword] = useState(false); // showPassword değişkenini tanımlayın

  if (isLoading) return null;

  // Şifre görünürlüğünü kontrol eden fonksiyonlar
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <Formik
      initialValues={{
        name: "",
        surname: "",
        username: "",
        password: "",
        specialization: "",
        phoneNumber: "",
        emailAddress: "",
        address: "",
      }}
      validationSchema={DoctorSchema}
      onSubmit={(values) => handleCreation(session, values)}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => (
        <div style={{ maxHeight: '100vh', overflowY: 'auto' }}>
          <Box p={4} mx={2}>
            {Object.keys(values).map((key) => (
              <Box key={key} mb={2}>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  {key === 'username' && <AccountCircleIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />}
                  {key === 'password' ? (
                    <FormControl sx={{ m: 1, width: '25ch' }} variant="standard">
                      <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                      <Input
                        id="standard-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        onChange={handleChange(key)}
                        onBlur={handleBlur(key)}
                        value={values[key]}
                        fullWidth
                        margin="dense"
                        error={errors[key] && touched[key]}
                        endAdornment={key === 'password' && (
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={handleClickShowPassword}
                              onMouseDown={handleMouseDownPassword}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )}
                      />
                      {errors[key] && touched[key] && (
                        <Typography variant="caption" color="error">{errors[key]}</Typography>
                      )}
                    </FormControl>
                  ) : (
                    key === 'phoneNumber' ? (
                      <MuiTelInput
                        value={values[key]}
                        onChange={handleChange(key)}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        fullWidth
                        margin="dense"
                        variant="standard"
                        error={errors[key] && touched[key]}
                        helperText={errors[key] && touched[key] && errors[key]}
                      />
                    ) : (
                      key === 'address' ? (
                        <TextField
                          onChange={handleChange(key)}
                          onBlur={handleBlur(key)}
                          value={values[key]}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          variant="standard"
                          fullWidth
                          margin="dense"
                          multiline
                          sx={{ overflowY: 'auto', maxHeight: 120 }} // Stil düzenlemesi
                          error={errors[key] && touched[key]}
                          helperText={errors[key] && touched[key] && errors[key]}
                        />
                      ) : (
                        <TextField
                          onChange={handleChange(key)}
                          onBlur={handleBlur(key)}
                          value={values[key]}
                          label={key.charAt(0).toUpperCase() + key.slice(1)}
                          variant="standard"
                          fullWidth
                          margin="dense"
                          error={errors[key] && touched[key]}
                          helperText={errors[key] && touched[key] && errors[key]}
                        />
                      )
                    )
                  )}
                </Box>
              </Box>                                  
            ))}
            <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ borderRadius: 8, width: '100%' }}>
              <Typography variant="button" sx={{ color: 'white' }}>
                Submit
              </Typography>
            </Button>
          </Box>
        </div>
      )}
    </Formik>
  );  
};

export default CreateDoctorForm;

import RegisteredUserController from '@/actions/App/Http/Controllers/Auth/RegisteredUserController';
import { login } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { useState } from 'react';
import { LoaderCircle } from 'lucide-react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

export default function Register() {
  const [userType, setUserType] = useState('');

  return (
    <AuthLayout
      title="Create an account"
      description="Enter your details below to create your account"
    >
      <Head title="Register" />
      <Form
        {...RegisteredUserController.store.form()}
        resetOnSuccess={['password', 'password_confirmation']}
        disableWhileProcessing
        className="flex flex-col gap-6"
      >
        {({ processing, errors }) => (
          <>
            <div className="grid gap-6">
              {/* Select user type */}
              <div className="grid gap-2">
                <Label htmlFor="user_type">Type of Account</Label>
                <select
                  id="user_type"
                  name="user_type"
                  value={userType}
                  required
                  tabIndex={1}
                  onChange={(e) => setUserType(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="">Select an option</option>
                  <option value="customer">Cliente</option>
                  <option value="restaurant">Restaurante</option>
                </select>
                <InputError message={errors.user_type} />
              </div>

              {/* Common fields */}
              {userType && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      tabIndex={2}
                      autoComplete="email"
                      name="email"
                      placeholder="email@example.com"
                    />
                    <InputError message={errors.email} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      required
                      tabIndex={3}
                      autoComplete="new-password"
                      name="password"
                      placeholder="Password"
                    />
                    <InputError message={errors.password} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="password_confirmation">
                      Confirm password
                    </Label>
                    <Input
                      id="password_confirmation"
                      type="password"
                      required
                      tabIndex={4}
                      autoComplete="new-password"
                      name="password_confirmation"
                      placeholder="Confirm password"
                    />
                    <InputError message={errors.password_confirmation} />
                  </div>
                </>
              )}

              {/* Customer form */}
              {userType === 'customer' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="first_name">Nombres</Label>
                    <Input
                      id="first_name"
                      type="text"
                      required
                      tabIndex={5}
                      name="first_name"
                      placeholder="Nombres"
                    />
                    <InputError message={errors.first_name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="last_name">Apellidos</Label>
                    <Input
                      id="last_name"
                      type="text"
                      required
                      tabIndex={6}
                      name="last_name"
                      placeholder="Apellidos"
                    />
                    <InputError message={errors.last_name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="text"
                      tabIndex={7}
                      name="phone"
                      placeholder="Teléfono"
                    />
                    <InputError message={errors.phone} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="birth_date">Fecha de nacimiento</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      tabIndex={8}
                      name="birth_date"
                    />
                    <InputError message={errors.birth_date} />
                  </div>
                </>
              )}

              {/* Restaurant form */}
              {userType === 'restaurant' && (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="business_name">Nombre comercial del restaurante</Label>
                    <Input
                      id="business_name"
                      type="text"
                      required
                      tabIndex={5}
                      name="business_name"
                      placeholder="Nombre comercial"
                    />
                    <InputError message={errors.business_name} />
                  </div>

                  <div className="grid gap-2">

                    {/* nuevo campo */}
                  <Label htmlFor="responsible_name">Nombre del responsable</Label>
                  <Input
                    id="responsible_name"
                    type="text"
                    tabIndex={12}
                    name="responsible_name"
                    placeholder="Nombre del responsable"
                    required
                  />
                  <InputError message={errors.responsible_name} />
                </div>
                   {/* fin nuevo campo */}

                  <div className="grid gap-2">
                    <Label htmlFor="legal_name">Razón social del restaurante</Label>
                    <Input
                      id="legal_name"
                      type="text"
                      tabIndex={6}
                      name="legal_name"
                      placeholder="Razón social"
                    />
                    <InputError message={errors.legal_name} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="phone">Teléfono de contacto</Label>
                    <Input
                      id="phone"
                      type="text"
                      required
                      tabIndex={7}
                      name="phone"
                      placeholder="Teléfono de contacto"
                    />
                    <InputError message={errors.phone} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="legal_document">Número de documento legal</Label>
                    <Input
                      id="legal_document"
                      type="text"
                      tabIndex={8}
                      name="legal_document"
                      placeholder="NIT, RFC, etc."
                    />
                    <InputError message={errors.legal_document} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="business_license">Número de licencia comercial</Label>
                    <Input
                      id="business_license"
                      type="text"
                      tabIndex={9}
                      name="business_license"
                      placeholder="Número de licencia"
                    />
                    <InputError message={errors.business_license} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Descripción del restaurante</Label>
                    <Input
                      id="description"
                      type="text"
                      tabIndex={10}
                      name="description"
                      placeholder="Descripción"
                    />
                    <InputError message={errors.description} />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="logo_url">URL del logotipo del restaurante</Label>
                    <Input
                      id="logo_url"
                      type="text"
                      tabIndex={11}
                      name="logo_url"
                      placeholder="URL del logotipo"
                    />
                    <InputError message={errors.logo_url} />
                  </div>
                </>
              )}

              {/* Submit button */}
              {userType && (
                <Button
                  type="submit"
                  className="mt-2 w-full"
                  tabIndex={13}
                  data-test="register-user-button"
                  disabled={processing}
                >
                  {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  Create account
                </Button>
              )}
            </div>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <TextLink href={login()} tabIndex={13}>
                Log in
              </TextLink>
            </div>
          </>
        )}
      </Form>
    </AuthLayout>
  );
}

export type TypeUsers = {
  id: number;
  user_id: number;
  name: string;
  amount: number;
  email: string;
  tel: string;
  lat: number;
  long: number;
  description: string;
  createAt: Date;
};

export type TypeVaccine = {
  id: number;
  name: string;
  amount: number;
  lat: number;
  long: number;
  email: string;
  tel: string;
  description: string;
};

export type TypeNewVaccine = {
  user_id: any;
  name: string;
  amount: number;
  email: string;
  tel: string;
  lat: number;
  long: number;
  description: string;
};

export type typeUser = {
  id?: string;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  tel?: string;
  createAt?: Date;
};

export type typeNewUser = {
  id?: string;
  username?: string;
  password?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  tel?: string;
  createAt?: Date;
};

export let visibleCollapse:boolean = false

export const setVisibleCollapse = () => {
    if(visibleCollapse) visibleCollapse = false
    else visibleCollapse = true
}

export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
        resolve([position.coords.latitude, position.coords.longitude]);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  });
};

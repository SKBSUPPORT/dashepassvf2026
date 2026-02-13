import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { IonicSelectableComponent } from 'ionic-selectable';

@Component({
  selector: 'app-modulos',
  templateUrl: './modulos.page.html',
  styleUrls: ['./modulos.page.scss'],
})
export class ModulosPage implements OnInit {
  clientes: any[];
  clienteselect: boolean;
  clientecarga: any;
  cliente: string;
  modulos: any[];
  modulosstandard: any[];
  primeravez: string;
  arreglomodulos: any[];
  roles: any[];


  constructor() {

    this.modulos = [];
    this.modulosstandard = [];
    this.arreglomodulos = [];
    this.clienteselect = true;

    this.uploadmodulestandard();

    this.primeravez = "X";


  }



  uploadmodulestandard() {

    this.modulosstandard = [];

    //modulos de seguridad
    this.modulosstandard.push({ id: "escanearqr", label: "Escanear qr", access: false, rolesdefault: 'ADM/JEF/OTROS/SPV/SEC' });
    this.modulosstandard.push({ id: "marcas", label: "Marcas", access: false, rolesdefault: 'ADM/OTROS/SEC' });
    this.modulosstandard.push({ id: "autorizados", label: "Autorizados", access: false, rolesdefault: 'ADM/PRO/INQ/SEC' });
    this.modulosstandard.push({ id: "sos", label: "Llamadas SOS", access: false, rolesdefault: 'ADM/PRO/INQ/SEC' });
    this.modulosstandard.push({ id: "estacionamiento", label: "Estacionamiento", access: false, rolesdefault: 'ADM/SEC' });
    this.modulosstandard.push({ id: "usuarios", label: "Usuarios", access: false, rolesdefault: 'ADM/SEC' });
    this.modulosstandard.push({ id: "monitorhik", label: "Monitor hik", access: false, rolesdefault: 'ADM' });
    this.modulosstandard.push({ id: "link", label: "Epass link", access: false, rolesdefault: 'ADM/PRO/INQ/SEC' });
    this.modulosstandard.push({ id: "config", label: "Configuración", access: false, rolesdefault: 'ADM' });
    this.modulosstandard.push({ id: "asistencia", label: "Asistencia", access: false, rolesdefault: 'ADM/JEF/SPV' });
    this.modulosstandard.push({ id: "asistenciacon", label: "Control asistencia", access: false, rolesdefault: 'ADM/JEF' });
    this.modulosstandard.push({ id: "confighardware", label: "Hardware", access: false, rolesdefault: 'ADM' });
    //modulos gestiones
    this.modulosstandard.push({ id: "anuncios", label: "Anuncios", access: false, rolesdefault: 'ADM/SEC/PRO/INQ' });
    this.modulosstandard.push({ id: "documentos", label: "Documentos", access: false, rolesdefault: 'ADM/SEC/PRO/INQ' });
    this.modulosstandard.push({ id: "solicitudes", label: "Solicitudes", access: false, rolesdefault: 'ADM/PRO/INQ' });
    this.modulosstandard.push({ id: "reservas", label: "Reservas", access: false, rolesdefault: 'ADM/SEC/PRO/INQ' });
    this.modulosstandard.push({ id: "estado", label: "Estado", access: false, rolesdefault: 'ADM/PRO/INQ' });
    this.modulosstandard.push({ id: "lecturas", label: "Medidores", access: false, rolesdefault: 'ADM/PRO' });
    this.modulosstandard.push({ id: "check", label: "Check List", access: false, rolesdefault: 'ADM/SEC' });
    this.modulosstandard.push({ id: "database", label: "Base de datos", access: false, rolesdefault: 'ADM/SEC' });
    this.modulosstandard.push({ id: "estadoqb", label: "Estado cuenta Quickbooks", access: false, rolesdefault: 'PRO/INQ' });
    this.modulosstandard.push({ id: "confestadoqb", label: "Configuración Quickbooks", access: false, rolesdefault: 'ADM' });
  }

  ngOnInit() {
    this.getclientes();
  }

  getclientes() {

    firebase.firestore().collection("condominios")
      .orderBy("nombre", "asc")
      .get()
      .then(async docs => {

        this.clientes = [];
        docs.forEach(doc => {
          console.log(doc.data());
          this.clientes.push({ id: doc.data().id, name: doc.data().nombre });
        })
      })
      .catch(error => {
        console.log("error obteniendo datos");
      })


  }

  clienteChange(event: {
    component: IonicSelectableComponent,
    value: any
  }) {
    console.log('cliente:', event.value);

    this.clientecarga = event.value;

    if (this.clientecarga == undefined) {
      this.clienteselect = true;
    } else {
      this.clienteselect = false;
      //this.getinfo();
      this.getmodules();
    }

  }
  getmodules() {

    this.uploadmodulestandard();

    this.arreglomodulos = [];

    console.log("entra a get modules");

    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .get()
      .then(doc => {

        if (doc.data().modulos == undefined) {

        } else {

          var arreglo = doc.data().modulos;

          console.log(arreglo);

          i = 0;
          for (var i = 0; i < arreglo.length; i++) {

            var modulo = arreglo[i].split("-", 2);

            this.roles = modulo[1].split("/", 7);

            this.arreglomodulos.push({ id: modulo[0], roles: this.roles, rolesstring: modulo[1] });

          }



          h = 0;
          for (var h = 0; h < this.modulosstandard.length; h++) {

            const result = this.arreglomodulos.find(({ id }) => id === this.modulosstandard[h].id);

            if (result == undefined) {

              //deshabilitar modulo en cliente
              this.modulosstandard[h].access = false;
              this.modulosstandard[h].color = 'medium';

              //limpiar variable de roles              
              this.modulosstandard[h].roles = [];

              //deshabilitar manejo de roles

              this.modulosstandard[h].disabledadm = true;
              this.modulosstandard[h].disabledpro = true;
              this.modulosstandard[h].disabledinq = true;
              this.modulosstandard[h].disabledsec = true;
              this.modulosstandard[h].disabledjef = true;
              this.modulosstandard[h].disabledotros = true;
              this.modulosstandard[h].disabledspv = true;

              this.modulosstandard[h].accessadm = false;
              this.modulosstandard[h].accesspro = false;
              this.modulosstandard[h].accessinq = false;
              this.modulosstandard[h].accesssec = false;
              this.modulosstandard[h].accessjef = false;
              this.modulosstandard[h].accessotros = false;
              this.modulosstandard[h].accessspv = false;

              this.modulosstandard[h].rolecoloradm = 'medium';
              this.modulosstandard[h].rolecolorpro = 'medium';
              this.modulosstandard[h].rolecolorinq = 'medium';
              this.modulosstandard[h].rolecolorsec = 'medium';
              this.modulosstandard[h].rolecolorjef = 'medium';
              this.modulosstandard[h].rolecolorotros = 'medium';
              this.modulosstandard[h].rolecolorspv = 'medium';

            } else {

              console.log(result);

              //deshabilitar modulo en cliente
              this.modulosstandard[h].access = true;
              this.modulosstandard[h].color = 'success';

              //asignar variable de roles   
              this.modulosstandard[h].roles = result.roles;

              //asignar variable de rolesstring   
              this.modulosstandard[h].rolesstring = result.rolesstring;

              //habilitar manejo de roles
              console.log("coloca los datos disabled en false");
              this.modulosstandard[h].disabledadm = false;
              this.modulosstandard[h].disabledpro = false;
              this.modulosstandard[h].disabledinq = false;
              this.modulosstandard[h].disabledsec = false;
              this.modulosstandard[h].disabledjef = false;
              this.modulosstandard[h].disabledotros = false;
              this.modulosstandard[h].disabledspv = false;

              //asignar false o true a cada botón en el rol
              if (result.roles == undefined) {

                this.modulosstandard[h].accessadm = false;
                this.modulosstandard[h].accesspro = false;
                this.modulosstandard[h].accessinq = false;
                this.modulosstandard[h].accesssec = false;
                this.modulosstandard[h].accessjef = false;
                this.modulosstandard[h].accessotros = false;
                this.modulosstandard[h].accessspv = false;

                this.modulosstandard[h].rolecoloradm = 'medium';
                this.modulosstandard[h].rolecolorpro = 'medium';
                this.modulosstandard[h].rolecolorinq = 'medium';
                this.modulosstandard[h].rolecolorsec = 'medium';
                this.modulosstandard[h].rolecolorjef = 'medium';
                this.modulosstandard[h].rolecolorotros = 'medium';
                this.modulosstandard[h].rolecolorspv = 'medium';




              } else {

                var findadm = result.roles.find((elem: string) => elem === "ADM");
                var findpro = result.roles.find((elem: string) => elem === "PRO");
                var findinq = result.roles.find((elem: string) => elem === "INQ");
                var findsec = result.roles.find((elem: string) => elem === "SEC");
                var findjef = result.roles.find((elem: string) => elem === "JEF");
                var findotros = result.roles.find((elem: string) => elem === "OTROS");
                var findspv = result.roles.find((elem: string) => elem === "SPV");

                if (findadm == undefined) {
                  this.modulosstandard[h].accessadm = false;
                  this.modulosstandard[h].rolecoloradm = 'medium';
                } else {
                  this.modulosstandard[h].accessadm = true;
                  this.modulosstandard[h].rolecoloradm = 'success';
                }

                if (findpro == undefined) {
                  this.modulosstandard[h].accesspro = false;
                  this.modulosstandard[h].rolecolorpro = 'medium';
                } else {
                  this.modulosstandard[h].accesspro = true;
                  this.modulosstandard[h].rolecolorpro = 'success';
                }

                if (findinq == undefined) {
                  this.modulosstandard[h].accessinq = false;
                  this.modulosstandard[h].rolecolorinq = 'medium';
                } else {
                  this.modulosstandard[h].accessinq = true;
                  this.modulosstandard[h].rolecolorinq = 'success';
                }

                if (findsec == undefined) {
                  this.modulosstandard[h].accesssec = false;
                  this.modulosstandard[h].rolecolorsec = 'medium';
                } else {
                  this.modulosstandard[h].accesssec = true;
                  this.modulosstandard[h].rolecolorsec = 'success';
                }

                if (findjef == undefined) {
                  this.modulosstandard[h].accessjef = false;
                  this.modulosstandard[h].rolecolorjef = 'medium';
                } else {
                  this.modulosstandard[h].accessjef = true;
                  this.modulosstandard[h].rolecolorjef = 'success';
                }

                if (findotros == undefined) {
                  this.modulosstandard[h].accessotros = false;
                  this.modulosstandard[h].rolecolorotros = 'medium';
                } else {
                  this.modulosstandard[h].accessotros = true;
                  this.modulosstandard[h].rolecolorotros = 'success';
                }

                if (findspv == undefined) {
                  this.modulosstandard[h].accessspv = false;
                  this.modulosstandard[h].rolecolorspv = 'medium';
                } else {
                  this.modulosstandard[h].accessspv = true;
                  this.modulosstandard[h].rolecolorspv = 'success';
                }



              }


            }


          }

          console.log(this.modulosstandard);

        }

      })
      .catch(error => {
        console.log("error obteniendo datos");
      })
  }


  createmodule(array, valor) {
    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .collection("modulos")
      .doc(array.id)
      .set({
        label: array.label,
        access: valor,
        roles: array.roles
      })
      .then(doc => {

        console.log("Creado módulo: " + array.label);

      })
      .catch(error => {
        console.log("error creado modulos");
      })
  }

  updatemodule(array, valor) {
    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .collection("modulos")
      .doc(array.id)
      .update({
        label: array.label,
        access: valor
      })
      .then(doc => {

        console.log("Actualizado módulo: " + array.label);

      })
      .catch(error => {
        console.log("error creado modulos");
      })
  }



  changemodule(modulo, event) {

    console.log("entro a changemodule ");
    console.log(modulo);

    if (modulo.access == true) {
      console.log("quieres deshabilitar?");
      var newvalor = false;
    } else if (modulo.access == false) {
      console.log("quieres habilitar?");
      var newvalor = true;
    }

    //consultar modules
    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .get()
      .then(doc => {

        if (doc.data().modulos == undefined || doc.data().modulos == "") {
          console.log("entro por acá")

          if (newvalor == true) {
            this.activatemodule(modulo.id + "-" + modulo.rolesdefault);
          } else {
            console.log("si no hay datos no hay nada por desactivar");
          }

        } else {
          var largo = doc.data().modulos;
          if (largo < 1) {
            console.log("no hay datos");
            if (newvalor == true) {
              this.activatemodule(modulo.id + "-" + modulo.rolesdefault);
            } else {
              console.log("si no hay datos no hay nada por desactivar");
            }
          } else {


            console.log("hay datos creados");

            var datos = doc.data().modulos;

            i = 0;
            for (var i = 0; i < datos.length; i++) {

              var activemodule = datos[i].split("-", 2);

              console.log(activemodule[0]);

              if (activemodule[0] == modulo.id) {

                if (newvalor == true) {
                  console.log(activemodule[0] + " si está, por lo tanto se debe borrar y actualizar, pues entra en true");
                  //pendiente acá methodo de actualización
                } else if (newvalor == false) {
                  console.log(activemodule[0] + " si está, por lo tanto se debe desactivar, pues entra en falso");
                  this.deletemodule(modulo);
                }

                // this.deletemoduleandactivate(modulo, modulo.id + "-" + modulo.rolesdefault);

                var modulefound = true;

              }


            }

            if (modulefound != true) {
              console.log("el módulo no fue encontrado, se debe validar la creación");

              if (newvalor == true) {
                console.log("el evento está en true, se debe crear el modulo");
                this.activatemodule(modulo.id + "-" + modulo.rolesdefault);
              } else if (newvalor == false) {
                console.log("el evento está en false, NO se debe crear el modulo");
              }

            }


          }

        }



      })
      .catch(error => {
        console.log("error obteniendo datos");
      })








  }


  deletemodule(modulo: any) {


    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .update({
        modulos: firebase.firestore.FieldValue.arrayRemove(modulo.id + "-" + modulo.rolesstring)
      })
      .then(doc => {

        console.log("modulo eliminado");

        this.getmodules();

      })
      .catch(error => {
        console.log("error borrando modulo");
      })

  }


  deletemoduleandactivate(modulo: any, newmodulo: any) {


    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .update({
        modulos: firebase.firestore.FieldValue.arrayRemove(modulo.id + "-" + modulo.rolesstring)
      })
      .then(doc => {

        console.log("modulo eliminado");

        //se procede a crear el nuevo juego de datos

        this.activatemodule(modulo.id + "-" + modulo.rolesdefault);

      })
      .catch(error => {
        console.log("error borrando modulo");
      })

  }
  activatemodule(newmodule: string) {

    firebase.firestore().collection("customer")
      .doc(this.clientecarga.id)
      .update({
        modulos: firebase.firestore.FieldValue.arrayUnion(newmodule)
      })
      .then(doc => {

        console.log("modulo activado");

        this.getmodules();
        //se procede a crear el nuevo juego de datos

      })
      .catch(error => {
        console.log("error activando modulo");
      })

  }


  //funcion para cmabiar valor a los modulos
  changeval(modulo, event) {
    console.log(modulo);
    console.log(event.detail.checked);

    const result = this.modulos.find(({ id }) => id === modulo.id);

    if (result == true) {
      this.updatemodule(modulo, event.detail.checked);

    } else {
      this.createmodule(modulo, event.detail.checked);
    }

    i = 0;

    for (var i = 0; i < this.modulosstandard.length; i++) {

      if (modulo.id == this.modulosstandard[i].id) {
        if (event.detail.checked == false) {
          this.modulosstandard[i].disabledadm = true;
          this.modulosstandard[i].disabledpro = true;
          this.modulosstandard[i].disabledinq = true;
          this.modulosstandard[i].disabledsec = true;
          this.modulosstandard[i].disabledjef = true;
          this.modulosstandard[i].disabledotros = true;
          this.modulosstandard[i].disabledspv = true;
        } else if (event.detail.checked == true) {
          this.modulosstandard[i].disabledadm = false;
          this.modulosstandard[i].disabledpro = false;
          this.modulosstandard[i].disabledinq = false;
          this.modulosstandard[i].disabledsec = false;
          this.modulosstandard[i].disabledjef = false;
          this.modulosstandard[i].disabledotros = false;
          this.modulosstandard[i].disabledspv = false;
        }
      }



    }




  }



  //funcion para agregar o quitar roles en los módulos
  changerole(modulo, event, rol) {
    console.log(rol);
    console.log("sigue el evento");
    console.log(event.detail);
    console.log(modulo.id);
    console.log(modulo);
    console.log(event.detail.checked);

    if (modulo.access == true) {
      console.log("quieres deshabilitar?");
      var newvalor = false;
    } else if (modulo.access == false) {
      console.log("quieres habilitar?");
      var newvalor = true;
    }



    if (rol == 'ADM') {

      if (modulo.accessadm == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accessadm == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }

    } else if (rol == 'PRO') {

      if (modulo.accesspro == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accesspro == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }

    } else if (rol == 'INQ') {

      if (modulo.accessinq == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accessinq == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }


    } else if (rol == 'SEC') {

      if (modulo.accesssec == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accesssec == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }

    } else if (rol == 'JEF') {

      if (modulo.accessjef == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accessjef == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }

    } else if (rol == 'OTROS') {

      if (modulo.accessotros == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accessotros == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }

    } else if (rol == 'SPV') {

      if (modulo.accessspv == true) {
        console.log("quieres deshabilitar?");
        var newvalor = false;
      } else if (modulo.accessspv == false) {
        console.log("quieres habilitar?");
        var newvalor = true;
      }

    }


    this.updaterol(modulo, rol, newvalor);

  }
  async updaterol(modulo, rol, action) {


    if (action == true) {

      console.log(modulo);
      console.log(rol);
      console.log("se debe agregar el rol");

      console.log("sigue arreglo viejo");
      console.log(modulo.id + "-" + modulo.rolesstring);
      console.log("sigue nuevo arreglo");
      console.log(modulo.id + "-" + modulo.rolesstring + "/" + rol);

      firebase.firestore().collection("customer")
        .doc(this.clientecarga.id)
        .update({
          modulos: firebase.firestore.FieldValue.arrayRemove(modulo.id + "-" + modulo.rolesstring)
        })
        .then(doc => {

          console.log("Rol viejo eliminado");

          firebase.firestore().collection("customer")
            .doc(this.clientecarga.id)
            .update({
              modulos: firebase.firestore.FieldValue.arrayUnion(modulo.id + "-" + modulo.rolesstring + "/" + rol)
            })
            .then(doc => {

              console.log("Rol actualizado");
              this.getmodules();

            })
            .catch(error => {
              console.log("error creado modulos");
            })


        })
        .catch(error => {
          console.log("error creado modulos");
        })

    } else if (action == false) {

      console.log(modulo);
      console.log(rol);
      console.log("se debe eliminar el rol");

      console.log("sigue arreglo viejo");
      console.log(modulo.id + "-" + modulo.rolesstring);

      console.log("sigue nuevo arreglo");
      var string = modulo.id + "-" + modulo.rolesstring;
      var newstring = string.replace("/" + rol, "");
      var newstring2 = newstring.replace("-" + rol, "-");
      var newstring3 = newstring2.replace("//", "/");
      var newstring4 = newstring3.replace("-/", "-");
      console.log(newstring4);



      firebase.firestore().collection("customer")
        .doc(this.clientecarga.id)
        .update({
          modulos: firebase.firestore.FieldValue.arrayRemove(modulo.id + "-" + modulo.rolesstring)
        })
        .then(doc => {

          console.log("Rol viejo eliminado");

          firebase.firestore().collection("customer")
            .doc(this.clientecarga.id)
            .update({
              modulos: firebase.firestore.FieldValue.arrayUnion(newstring4)
            })
            .then(doc => {

              console.log("Rol actualizado");
              this.getmodules();

            })
            .catch(error => {
              console.log("error creado modulos");
            })


        })
        .catch(error => {
          console.log("error creado modulos");
        })







    }


  }


}

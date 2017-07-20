using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using hidrocontroll.Models;
using hidrocontroll.api.Controllers;

namespace hidrocontroll.Controllers
{
    public class LoginController : BaseController
    {
        // POST api/Etapa
        public CAD_USUARIO Post(Login login)
        {
            try
            {
                CAD_USUARIO user = db.CAD_USUARIO.Where(u => u.NUM_MATRICULA == login.NUM_MATRICULA && u.CNF_SENHA == login.SENHA_USUARIO).First();

                return user;
            }
            catch (Exception exc)
            {

                throw new Exception("Usuário ou senha inválido", exc);
            }

        }
    }

    public class Login
    {
        public String NUM_MATRICULA { get; set; }
        public String SENHA_USUARIO { get; set; }
    }
}
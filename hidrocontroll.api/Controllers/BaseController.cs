using hidrocontroll.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace hidrocontroll.Controllers
{
    public class BaseController : ApiController
    {
        protected hidrocontrollEntities db = new hidrocontrollEntities();
        
        public BaseController()
        {
            db.Configuration.ProxyCreationEnabled = false;
        }

        public void Options()
        {
            //Intentionally left blank to just return an empty response to the browser when it asks for the options method
        }
    }

    public class TypeOfSearch
    {
        public String type { get; set; }
    }
}
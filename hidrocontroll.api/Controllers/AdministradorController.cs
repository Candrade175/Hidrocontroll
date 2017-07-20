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

namespace hidrocontroll.Controllers
{
    public class AdministradorController : BaseController
    {

        // GET api/Administrador
        public IQueryable<CAD_ADMINISTRADOR> GetCAD_ADMINISTRADOR()
        {
            return db.CAD_ADMINISTRADOR;
        }

        // GET api/Administrador/5
        [ResponseType(typeof(CAD_ADMINISTRADOR))]
        public IHttpActionResult GetCAD_ADMINISTRADOR(int id)
        {
            CAD_ADMINISTRADOR cad_administrador = db.CAD_ADMINISTRADOR.Find(id);
            if (cad_administrador == null)
            {
                return NotFound();
            }

            return Ok(cad_administrador);
        }

        // PUT api/Administrador/5
        public IHttpActionResult PutCAD_ADMINISTRADOR(string id, CAD_ADMINISTRADOR cad_administrador)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_administrador.USUARIO)
            {
                return BadRequest();
            }

            db.Entry(cad_administrador).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_ADMINISTRADORExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST api/Administrador
        [ResponseType(typeof(CAD_ADMINISTRADOR))]
        public IHttpActionResult PostCAD_ADMINISTRADOR(CAD_ADMINISTRADOR cad_administrador)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_ADMINISTRADOR.Add(cad_administrador);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateException)
            {
                if (CAD_ADMINISTRADORExists(cad_administrador.USUARIO))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtRoute("DefaultApi", new { id = cad_administrador.USUARIO }, cad_administrador);
        }

        // DELETE api/Administrador/5
        [ResponseType(typeof(CAD_ADMINISTRADOR))]
        public IHttpActionResult DeleteCAD_ADMINISTRADOR(int id)
        {
            CAD_ADMINISTRADOR cad_administrador = db.CAD_ADMINISTRADOR.Find(id);
            if (cad_administrador == null)
            {
                return NotFound();
            }

            db.CAD_ADMINISTRADOR.Remove(cad_administrador);
            db.SaveChanges();

            return Ok(cad_administrador);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_ADMINISTRADORExists(string id)
        {
            return db.CAD_ADMINISTRADOR.Count(e => e.USUARIO == id) > 0;
        }
    }
}
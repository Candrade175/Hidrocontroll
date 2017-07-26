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
    public class GotejadorController : ApiController
    {
        private hidrocontrollEntities db = new hidrocontrollEntities();

        // GET api/Gotejador
        public IQueryable<CAD_GOTEJADOR> GetCAD_GOTEJADOR()
        {
            return db.CAD_GOTEJADOR;
        }

        // GET api/Gotejador/5
        [ResponseType(typeof(CAD_GOTEJADOR))]
        public IHttpActionResult GetCAD_GOTEJADOR(int id)
        {
            CAD_GOTEJADOR cad_gotejador = db.CAD_GOTEJADOR.Find(id);
            if (cad_gotejador == null)
            {
                return NotFound();
            }

            return Ok(cad_gotejador);
        }

        // PUT api/Gotejador/5
        public IHttpActionResult PutCAD_GOTEJADOR(int id, CAD_GOTEJADOR cad_gotejador)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_gotejador.IDC_CAD_GOTEJADOR)
            {
                return BadRequest();
            }

            db.Entry(cad_gotejador).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_GOTEJADORExists(id))
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

        // POST api/Gotejador
        [ResponseType(typeof(CAD_GOTEJADOR))]
        public IHttpActionResult PostCAD_GOTEJADOR(CAD_GOTEJADOR cad_gotejador)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_GOTEJADOR.Add(cad_gotejador);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_gotejador.IDC_CAD_GOTEJADOR }, cad_gotejador);
        }

        // DELETE api/Gotejador/5
        [ResponseType(typeof(CAD_GOTEJADOR))]
        public IHttpActionResult DeleteCAD_GOTEJADOR(int id)
        {
            CAD_GOTEJADOR cad_gotejador = db.CAD_GOTEJADOR.Find(id);
            if (cad_gotejador == null)
            {
                return NotFound();
            }

            db.CAD_GOTEJADOR.Remove(cad_gotejador);
            db.SaveChanges();

            return Ok(cad_gotejador);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_GOTEJADORExists(int id)
        {
            return db.CAD_GOTEJADOR.Count(e => e.IDC_CAD_GOTEJADOR == id) > 0;
        }
    }
}
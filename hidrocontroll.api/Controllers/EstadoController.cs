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
    public class EstadoController : BaseController
    {

        // GET api/Estado
        public IQueryable<CAD_ESTADO> GetCAD_ESTADO()
        {
            return db.CAD_ESTADO;
        }

        // GET api/Estado/5
        [ResponseType(typeof(CAD_ESTADO))]
        public IHttpActionResult GetCAD_ESTADO(int id)
        {
            CAD_ESTADO cad_estado = db.CAD_ESTADO.Find(id);
            if (cad_estado == null)
            {
                return NotFound();
            }

            return Ok(cad_estado);
        }

        // PUT api/Estado/5
        public IHttpActionResult PutCAD_ESTADO(int id, CAD_ESTADO cad_estado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_estado.IDC_CAD_ESTADO)
            {
                return BadRequest();
            }

            db.Entry(cad_estado).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_ESTADOExists(id))
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

        // POST api/Estado
        [ResponseType(typeof(CAD_ESTADO))]
        public IHttpActionResult PostCAD_ESTADO(CAD_ESTADO cad_estado)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_ESTADO.Add(cad_estado);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_estado.IDC_CAD_ESTADO }, cad_estado);
        }

        // DELETE api/Estado/5
        [ResponseType(typeof(CAD_ESTADO))]
        public IHttpActionResult DeleteCAD_ESTADO(int id)
        {
            CAD_ESTADO cad_estado = db.CAD_ESTADO.Find(id);
            if (cad_estado == null)
            {
                return NotFound();
            }

            db.CAD_ESTADO.Remove(cad_estado);
            db.SaveChanges();

            return Ok(cad_estado);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_ESTADOExists(int id)
        {
            return db.CAD_ESTADO.Count(e => e.IDC_CAD_ESTADO == id) > 0;
        }
    }
}
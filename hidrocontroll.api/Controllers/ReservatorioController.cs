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
    public class ReservatorioController : BaseController
    {
        // GET api/Reservatorio
        public IQueryable<CAD_RESERVATORIO> GetCAD_RESERVATORIO()
        {
            return db.CAD_RESERVATORIO;
        }

        // GET api/Reservatorio/5
        [ResponseType(typeof(CAD_RESERVATORIO))]
        public IHttpActionResult GetCAD_RESERVATORIO(int id)
        {
            CAD_RESERVATORIO cad_reservatorio = db.CAD_RESERVATORIO.Find(id);
            if (cad_reservatorio == null)
            {
                return NotFound();
            }

            return Ok(cad_reservatorio);
        }

        // PUT api/Reservatorio/5
        public IHttpActionResult PutCAD_RESERVATORIO(int id, CAD_RESERVATORIO cad_reservatorio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_reservatorio.IDC_CAD_RESERVATORIO)
            {
                return BadRequest();
            }

            db.Entry(cad_reservatorio).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_RESERVATORIOExists(id))
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

        // POST api/Reservatorio
        [ResponseType(typeof(CAD_RESERVATORIO))]
        public IHttpActionResult PostCAD_RESERVATORIO(CAD_RESERVATORIO cad_reservatorio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_RESERVATORIO.Add(cad_reservatorio);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_reservatorio.IDC_CAD_RESERVATORIO }, cad_reservatorio);
        }

        // DELETE api/Reservatorio/5
        [ResponseType(typeof(CAD_RESERVATORIO))]
        public IHttpActionResult DeleteCAD_RESERVATORIO(int id)
        {
            CAD_RESERVATORIO cad_reservatorio = db.CAD_RESERVATORIO.Find(id);
            if (cad_reservatorio == null)
            {
                return NotFound();
            }

            db.CAD_RESERVATORIO.Remove(cad_reservatorio);
            db.SaveChanges();

            return Ok(cad_reservatorio);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_RESERVATORIOExists(int id)
        {
            return db.CAD_RESERVATORIO.Count(e => e.IDC_CAD_RESERVATORIO == id) > 0;
        }
    }
}
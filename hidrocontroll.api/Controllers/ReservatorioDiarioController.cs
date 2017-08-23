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
    public class ReservatorioDiarioController : BaseController
    {

        // GET api/ReservatorioDiario
        public IQueryable<CAD_RESERVATORIO_DIARIO> GetCAD_RESERVATORIO_DIARIO()
        {
            return db.CAD_RESERVATORIO_DIARIO;
        }

        // GET api/ReservatorioDiario/5
        [ResponseType(typeof(CAD_RESERVATORIO_DIARIO))]
        public IHttpActionResult GetCAD_RESERVATORIO_DIARIO(int id)
        {
            CAD_RESERVATORIO_DIARIO cad_reservatorio_diario = db.CAD_RESERVATORIO_DIARIO.Find(id);
            if (cad_reservatorio_diario == null)
            {
                return NotFound();
            }

            return Ok(cad_reservatorio_diario);
        }

        // PUT api/ReservatorioDiario/5
        public IHttpActionResult PutCAD_RESERVATORIO_DIARIO(int id, CAD_RESERVATORIO_DIARIO cad_reservatorio_diario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_reservatorio_diario.IDC_CAD_RESERVATORIO_DIARIO)
            {
                return BadRequest();
            }

            db.Entry(cad_reservatorio_diario).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_RESERVATORIO_DIARIOExists(id))
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

        // POST api/ReservatorioDiario
        [ResponseType(typeof(CAD_RESERVATORIO_DIARIO))]
        public IHttpActionResult PostCAD_RESERVATORIO_DIARIO(CAD_RESERVATORIO_DIARIO cad_reservatorio_diario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_RESERVATORIO_DIARIO.Add(cad_reservatorio_diario);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_reservatorio_diario.IDC_CAD_RESERVATORIO_DIARIO }, cad_reservatorio_diario);
        }

        // DELETE api/ReservatorioDiario/5
        [ResponseType(typeof(CAD_RESERVATORIO_DIARIO))]
        public IHttpActionResult DeleteCAD_RESERVATORIO_DIARIO(int id)
        {
            CAD_RESERVATORIO_DIARIO cad_reservatorio_diario = db.CAD_RESERVATORIO_DIARIO.Find(id);
            if (cad_reservatorio_diario == null)
            {
                return NotFound();
            }

            db.CAD_RESERVATORIO_DIARIO.Remove(cad_reservatorio_diario);
            db.SaveChanges();

            return Ok(cad_reservatorio_diario);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_RESERVATORIO_DIARIOExists(int id)
        {
            return db.CAD_RESERVATORIO_DIARIO.Count(e => e.IDC_CAD_RESERVATORIO_DIARIO == id) > 0;
        }
    }
}
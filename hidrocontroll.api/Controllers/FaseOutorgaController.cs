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
    public class FaseOutorgaController : BaseController
    {

        // GET api/FaseOutorga
        public IQueryable<CAD_FASE_OUTORGA> GetCAD_FASE_OUTORGA()
        {
            return db.CAD_FASE_OUTORGA;
        }

        // GET api/FaseOutorga/5
        [ResponseType(typeof(CAD_FASE_OUTORGA))]
        public IHttpActionResult GetCAD_FASE_OUTORGA(int id)
        {
            CAD_FASE_OUTORGA cad_fase_outorga = db.CAD_FASE_OUTORGA.Find(id);
            if (cad_fase_outorga == null)
            {
                return NotFound();
            }

            return Ok(cad_fase_outorga);
        }

        // PUT api/FaseOutorga/5
        public IHttpActionResult PutCAD_FASE_OUTORGA(int id, CAD_FASE_OUTORGA cad_fase_outorga)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_fase_outorga.IDC_CAD_FASE_OUTORGA)
            {
                return BadRequest();
            }

            db.Entry(cad_fase_outorga).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_FASE_OUTORGAExists(id))
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

        // POST api/FaseOutorga
        [ResponseType(typeof(CAD_FASE_OUTORGA))]
        public IHttpActionResult PostCAD_FASE_OUTORGA(CAD_FASE_OUTORGA cad_fase_outorga)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_FASE_OUTORGA.Add(cad_fase_outorga);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_fase_outorga.IDC_CAD_FASE_OUTORGA }, cad_fase_outorga);
        }

        // DELETE api/FaseOutorga/5
        [ResponseType(typeof(CAD_FASE_OUTORGA))]
        public IHttpActionResult DeleteCAD_FASE_OUTORGA(int id)
        {
            CAD_FASE_OUTORGA cad_fase_outorga = db.CAD_FASE_OUTORGA.Find(id);
            if (cad_fase_outorga == null)
            {
                return NotFound();
            }

            db.CAD_FASE_OUTORGA.Remove(cad_fase_outorga);
            db.SaveChanges();

            return Ok(cad_fase_outorga);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_FASE_OUTORGAExists(int id)
        {
            return db.CAD_FASE_OUTORGA.Count(e => e.IDC_CAD_FASE_OUTORGA == id) > 0;
        }
    }
}
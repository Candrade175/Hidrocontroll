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
    public class OutorgaController : BaseController
    {

        // GET api/Outorga
        public IQueryable<CAD_OUTORGA> GetCAD_OUTORGA()
        {
            return db.CAD_OUTORGA;
        }

        // GET api/Outorga/5
        [ResponseType(typeof(CAD_OUTORGA))]
        public IHttpActionResult GetCAD_OUTORGA(int id)
        {
            CAD_OUTORGA cad_outorga = db.CAD_OUTORGA.Find(id);
            if (cad_outorga == null)
            {
                return NotFound();
            }

            return Ok(cad_outorga);
        }

        // PUT api/Outorga/5
        public IHttpActionResult PutCAD_OUTORGA(int id, CAD_OUTORGA cad_outorga)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_outorga.IDC_CAD_OUTORGA)
            {
                return BadRequest();
            }

            db.Entry(cad_outorga).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_OUTORGAExists(id))
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

        // POST api/Outorga
        [ResponseType(typeof(CAD_OUTORGA))]
        public IHttpActionResult PostCAD_OUTORGA(CAD_OUTORGA cad_outorga)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_OUTORGA.Add(cad_outorga);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_outorga.IDC_CAD_OUTORGA }, cad_outorga);
        }

        // DELETE api/Outorga/5
        [ResponseType(typeof(CAD_OUTORGA))]
        public IHttpActionResult DeleteCAD_OUTORGA(int id)
        {
            CAD_OUTORGA cad_outorga = db.CAD_OUTORGA.Find(id);
            if (cad_outorga == null)
            {
                return NotFound();
            }

            db.CAD_OUTORGA.Remove(cad_outorga);
            db.SaveChanges();

            return Ok(cad_outorga);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_OUTORGAExists(int id)
        {
            return db.CAD_OUTORGA.Count(e => e.IDC_CAD_OUTORGA == id) > 0;
        }
    }
}
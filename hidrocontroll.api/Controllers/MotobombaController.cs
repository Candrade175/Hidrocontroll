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
    public class MotobombaController : BaseController
    {

        // GET api/Motobomba
        public IQueryable<CAD_MOTOBOMBA> GetCAD_MOTOBOMBA()
        {
            return db.CAD_MOTOBOMBA;
        }

        // GET api/Motobomba/5
        [ResponseType(typeof(CAD_MOTOBOMBA))]
        public IHttpActionResult GetCAD_MOTOBOMBA(int id)
        {
            CAD_MOTOBOMBA cad_motobomba = db.CAD_MOTOBOMBA.Find(id);
            if (cad_motobomba == null)
            {
                return NotFound();
            }

            return Ok(cad_motobomba);
        }

        // PUT api/Motobomba/5
        public IHttpActionResult PutCAD_MOTOBOMBA(int id, CAD_MOTOBOMBA cad_motobomba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_motobomba.IDC_CAD_MOTOBOMBA)
            {
                return BadRequest();
            }

            db.Entry(cad_motobomba).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_MOTOBOMBAExists(id))
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

        // POST api/Motobomba
        [ResponseType(typeof(CAD_MOTOBOMBA))]
        public IHttpActionResult PostCAD_MOTOBOMBA(CAD_MOTOBOMBA cad_motobomba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_MOTOBOMBA.Add(cad_motobomba);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_motobomba.IDC_CAD_MOTOBOMBA }, cad_motobomba);
        }

        // DELETE api/Motobomba/5
        [ResponseType(typeof(CAD_MOTOBOMBA))]
        public IHttpActionResult DeleteCAD_MOTOBOMBA(int id)
        {
            CAD_MOTOBOMBA cad_motobomba = db.CAD_MOTOBOMBA.Find(id);
            if (cad_motobomba == null)
            {
                return NotFound();
            }

            db.CAD_MOTOBOMBA.Remove(cad_motobomba);
            db.SaveChanges();

            return Ok(cad_motobomba);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_MOTOBOMBAExists(int id)
        {
            return db.CAD_MOTOBOMBA.Count(e => e.IDC_CAD_MOTOBOMBA == id) > 0;
        }
    }
}
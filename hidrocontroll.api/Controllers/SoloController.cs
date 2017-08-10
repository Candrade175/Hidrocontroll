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
    public class SoloController : BaseController
    {

        // GET api/Solo
        public IQueryable<CAD_SOLO> GetCAD_SOLO()
        {
            return db.CAD_SOLO;
        }

        // GET api/Solo/5
        [ResponseType(typeof(CAD_SOLO))]
        public IHttpActionResult GetCAD_SOLO(int id)
        {
            CAD_SOLO cad_solo = db.CAD_SOLO.Find(id);
            if (cad_solo == null)
            {
                return NotFound();
            }

            return Ok(cad_solo);
        }

        // PUT api/Solo/5
        public IHttpActionResult PutCAD_SOLO(int id, CAD_SOLO cad_solo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_solo.IDC_CAD_SOLO)
            {
                return BadRequest();
            }

            db.Entry(cad_solo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_SOLOExists(id))
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

        // POST api/Solo
        [ResponseType(typeof(CAD_SOLO))]
        public IHttpActionResult PostCAD_SOLO(CAD_SOLO cad_solo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_SOLO.Add(cad_solo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_solo.IDC_CAD_SOLO }, cad_solo);
        }

        // DELETE api/Solo/5
        [ResponseType(typeof(CAD_SOLO))]
        public IHttpActionResult DeleteCAD_SOLO(int id)
        {
            CAD_SOLO cad_solo = db.CAD_SOLO.Find(id);
            if (cad_solo == null)
            {
                return NotFound();
            }

            db.CAD_SOLO.Remove(cad_solo);
            db.SaveChanges();

            return Ok(cad_solo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_SOLOExists(int id)
        {
            return db.CAD_SOLO.Count(e => e.IDC_CAD_SOLO == id) > 0;
        }
    }
}
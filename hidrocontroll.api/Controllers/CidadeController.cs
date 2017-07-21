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
    public class CidadeController : BaseController
    {

        // GET api/Cidade
        public IQueryable<CAD_CIDADE> GetCAD_CIDADE()
        {
            return db.CAD_CIDADE;
        }

        // GET api/Cidade/5
        [ResponseType(typeof(CAD_CIDADE))]
        public IHttpActionResult GetCAD_CIDADE(int id)
        {
            CAD_CIDADE cad_cidade = db.CAD_CIDADE.Find(id);
            if (cad_cidade == null)
            {
                return NotFound();
            }

            return Ok(cad_cidade);
        }

        // PUT api/Cidade/5
        public IHttpActionResult PutCAD_CIDADE(int id, CAD_CIDADE cad_cidade)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != cad_cidade.IDC_CAD_CIDADE)
            {
                return BadRequest();
            }

            db.Entry(cad_cidade).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!CAD_CIDADEExists(id))
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

        // POST api/Cidade
        [ResponseType(typeof(CAD_CIDADE))]
        public IHttpActionResult PostCAD_CIDADE(CAD_CIDADE cad_cidade)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.CAD_CIDADE.Add(cad_cidade);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = cad_cidade.IDC_CAD_CIDADE }, cad_cidade);
        }

        // DELETE api/Cidade/5
        [ResponseType(typeof(CAD_CIDADE))]
        public IHttpActionResult DeleteCAD_CIDADE(int id)
        {
            CAD_CIDADE cad_cidade = db.CAD_CIDADE.Find(id);
            if (cad_cidade == null)
            {
                return NotFound();
            }

            db.CAD_CIDADE.Remove(cad_cidade);
            db.SaveChanges();

            return Ok(cad_cidade);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool CAD_CIDADEExists(int id)
        {
            return db.CAD_CIDADE.Count(e => e.IDC_CAD_CIDADE == id) > 0;
        }
    }
}